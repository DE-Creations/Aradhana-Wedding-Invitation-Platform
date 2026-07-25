<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaUrl
{
    /**
     * Convert a stored file path into a public URL.
     * Passes through values that are already absolute URLs.
     */
    public static function url(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '/storage/'])) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
