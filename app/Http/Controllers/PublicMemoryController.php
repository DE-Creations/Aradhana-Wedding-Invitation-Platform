<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Memory;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PublicMemoryController extends Controller
{
    private const MAX_FILE_SIZE_MB = 15;

    public function upload(Request $request)
    {
        $token   = $request->input('token');
        $guestId = $request->input('guest_id');

        // Resolve wedding
        $wedding = Wedding::where('event_token', $token)
            ->where('status', '!=', 'draft')
            ->with('user')
            ->first();

        if (! $wedding) {
            return response()->json(['error' => 'Invalid event token.'], 422);
        }

        // Enforce share_memory feature flag
        if (! $wedding->user || ! $wedding->user->share_memory) {
            return response()->json(['error' => 'Memory sharing is not enabled for this event.'], 403);
        }

        // Resolve guest
        $guest = Guest::where('id', $guestId)
            ->where('wedding_id', $wedding->id)
            ->first();

        if (! $guest) {
            return response()->json(['error' => 'Guest not found.'], 422);
        }

        // Validate incoming files
        $request->validate([
            'images'   => ['required', 'array', 'min:1'],
            'images.*' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp,gif',
                'max:' . (self::MAX_FILE_SIZE_MB * 1024),
            ],
        ]);

        $files = $request->file('images');

        // Enforce total-upload cap per guest (use the user's configured image_count)
        $maxImagesPerGuest = max(1, (int) $wedding->user->image_count);

        $existing = Memory::where('wedding_id', $wedding->id)
            ->where('guest_id', $guest->id)
            ->count();

        $remaining = $maxImagesPerGuest - $existing;

        if ($remaining <= 0) {
            return response()->json([
                'error' => 'You have already reached the maximum of ' . $maxImagesPerGuest . ' uploads.',
            ], 422);
        }

        $files = array_slice($files, 0, $remaining);

        // Build safe sub-folder from guest name: "Amitha & Family" → "Amitha & Family"
        $guestFolderName = Str::limit($guest->guest_name, 60, '');
        // Remove characters unsafe for folder names on any OS
        $guestFolderName = preg_replace('/[\\\\\/\:\*\?\"\<\>\|]/', '_', $guestFolderName);

        // Same wedding-folder naming used for the main image / gallery images
        $weddingFolderName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $wedding->user->name ?? 'user_' . $wedding->user_id);

        // Store in storage/app/public/weddings/{wedding_folder}/guest-images/{guest_folder}/
        $diskPath = 'weddings/' . $weddingFolderName . '/guest-images/' . $guestFolderName;

        $uploaded = [];

        foreach ($files as $file) {
            $extension = $file->getClientOriginalExtension() ?: 'jpg';
            $fileName  = Str::uuid() . '.' . $extension;

            $path = $file->storeAs($diskPath, $fileName, 'public');

            // Compress / resize to reduce storage footprint
            $this->compressStoredImage($path, $file->getMimeType() ?? 'image/jpeg');

            $memory = Memory::create([
                'wedding_id'  => $wedding->id,
                'guest_id'    => $guest->id,
                'image_path'  => $path,
                'file_name'   => $file->getClientOriginalName(),
                'file_size'   => $file->getSize(),
                'mime_type'   => $file->getMimeType(),
                'status'      => 'pending',
                'uploaded_at' => now(),
            ]);

            $uploaded[] = [
                'id'  => $memory->id,
                'url' => Storage::url($path),
            ];
        }

        $originalCount = count($request->file('images'));
        $skipped = max(0, $originalCount - count($files));

        // Update the guest's running upload count (column already exists on guests table)
        $guest->increment('image_count', count($uploaded));

        return response()->json([
            'uploaded'  => count($uploaded),
            'skipped'   => $skipped,
            'images'    => $uploaded,
            'new_count' => $guest->fresh()->image_count,
            'max_count' => $maxImagesPerGuest,
            'message'   => count($uploaded) . ' photo(s) uploaded successfully.' .
                ($skipped > 0 ? " {$skipped} skipped (limit reached)." : ''),
        ]);
    }

    /**
     * Compress and resize a stored image using PHP's GD extension.
     * Skips silently if GD is unavailable or the file is already compact.
     */
    private function compressStoredImage(string $storagePath, string $mimeType): void
    {
        if (! extension_loaded('gd')) {
            return;
        }

        $fullPath = storage_path('app/public/' . $storagePath);
        if (! file_exists($fullPath)) {
            return;
        }

        $imageInfo = @getimagesize($fullPath);
        if (! $imageInfo) {
            return;
        }

        [$origW, $origH] = $imageInfo;
        $maxDim    = 1920;
        $threshold = 500 * 1024; // 500 KB

        // Already small enough — nothing to do
        if ($origW <= $maxDim && $origH <= $maxDim && filesize($fullPath) <= $threshold) {
            return;
        }

        // Maintain aspect ratio
        if ($origW >= $origH && $origW > $maxDim) {
            $newW = $maxDim;
            $newH = (int) round($origH * $maxDim / $origW);
        } elseif ($origH > $origW && $origH > $maxDim) {
            $newH = $maxDim;
            $newW = (int) round($origW * $maxDim / $origH);
        } else {
            $newW = $origW;
            $newH = $origH;
        }

        $src = match ($mimeType) {
            'image/jpeg' => @imagecreatefromjpeg($fullPath),
            'image/png'  => @imagecreatefrompng($fullPath),
            'image/webp' => @imagecreatefromwebp($fullPath),
            default      => null, // skip GIF etc.
        };

        if (! $src) {
            return;
        }

        $dst = imagecreatetruecolor($newW, $newH);

        if ($mimeType === 'image/png') {
            imagealphablending($dst, false);
            imagesavealpha($dst, true);
            $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
            imagefilledrectangle($dst, 0, 0, $newW, $newH, $transparent);
        }

        imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);

        match ($mimeType) {
            'image/png'  => imagepng($dst, $fullPath, 8),
            'image/webp' => imagewebp($dst, $fullPath, 82),
            default      => imagejpeg($dst, $fullPath, 82),
        };

        imagedestroy($src);
        imagedestroy($dst);
    }
}
