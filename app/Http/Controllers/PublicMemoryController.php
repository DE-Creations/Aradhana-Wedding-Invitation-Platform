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
    private const MAX_IMAGES_PER_GUEST = 20;
    private const MAX_FILE_SIZE_MB     = 5;

    public function upload(Request $request)
    {
        $token   = $request->input('token');
        $guestId = $request->input('guest_id');

        // Resolve wedding
        $wedding = Wedding::where('event_token', $token)
            ->where('status', '!=', 'draft')
            ->first();

        if (! $wedding) {
            return response()->json(['error' => 'Invalid event token.'], 422);
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

        // Enforce total-upload cap per guest
        $existing = Memory::where('wedding_id', $wedding->id)
            ->where('guest_id', $guest->id)
            ->count();

        $remaining = self::MAX_IMAGES_PER_GUEST - $existing;

        if ($remaining <= 0) {
            return response()->json([
                'error' => 'You have already reached the maximum of ' . self::MAX_IMAGES_PER_GUEST . ' uploads.',
            ], 422);
        }

        $files = array_slice($files, 0, $remaining);

        // Build safe sub-folder from guest name: "Amitha & Family" → "Amitha & Family"
        $folderName = Str::limit($guest->guest_name, 60, '');
        // Remove characters unsafe for folder names on any OS
        $folderName = preg_replace('/[\\\\\/\:\*\?\"\<\>\|]/', '_', $folderName);
        $diskPath   = 'guests-images/' . $folderName;

        $uploaded = [];

        foreach ($files as $file) {
            $extension = $file->getClientOriginalExtension() ?: 'jpg';
            $fileName  = Str::uuid() . '.' . $extension;

            // Store in storage/app/public/guests-images/{guest_name}/
            $path = $file->storeAs($diskPath, $fileName, 'public');

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

        $skipped = count(array_slice($request->file('images'), $remaining));

        return response()->json([
            'uploaded' => count($uploaded),
            'skipped'  => $skipped,
            'images'   => $uploaded,
            'message'  => count($uploaded) . ' photo(s) uploaded successfully.' .
                ($skipped > 0 ? " {$skipped} skipped (limit reached)." : ''),
        ]);
    }
}
