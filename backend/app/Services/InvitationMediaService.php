<?php

namespace App\Services;

use App\Models\Invitation;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class InvitationMediaService
{
    private const DIRECTORIES = [
        'couple_photo' => 'photos/couples',
        'groom_photo' => 'photos/grooms',
        'bride_photo' => 'photos/brides',
        'music' => 'music',
    ];

    /**
     * Store single-file media fields on an invitation from the request.
     * Deletes the previously stored file when replaced.
     *
     * @param  array<string, UploadedFile|null>  $files  keyed by request field name
     * @return array<string, string>  attributes to persist on the invitation
     */
    public function storeSingles(Invitation $invitation, array $files): array
    {
        $attributes = [];

        foreach ($files as $field => $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            // "music" maps to the music_url column; others match their column name.
            $column = $field === 'music' ? 'music_url' : $field;
            $directory = self::DIRECTORIES[$field] ?? 'photos/misc';

            $this->deleteIfExists($invitation->{$column} ?? null);
            $attributes[$column] = $this->store($file, $directory);
        }

        return $attributes;
    }

    /**
     * Store gallery photos (respecting the 20-photo cap).
     *
     * @param  array<int, UploadedFile>  $files
     */
    public function storeGallery(Invitation $invitation, array $files): void
    {
        $existing = $invitation->galleryPhotos()->count();
        $remaining = max(0, 20 - $existing);
        $files = array_slice($files, 0, $remaining);

        $order = $existing;
        foreach ($files as $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $invitation->galleryPhotos()->create([
                'photo_path' => $this->store($file, 'photos/gallery'),
                'sort_order' => $order++,
            ]);
        }
    }

    public function store(UploadedFile $file, string $directory): string
    {
        $name = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();

        return $file->storeAs($directory, $name, 'public');
    }

    public function deleteIfExists(?string $path): void
    {
        if (! blank($path) && ! Str::startsWith($path, ['http://', 'https://'])) {
            Storage::disk('public')->delete($path);
        }
    }
}
