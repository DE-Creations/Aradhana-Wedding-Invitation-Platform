<?php

namespace App\Http\Resources;

use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\GalleryPhoto
 */
class GalleryPhotoResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'photo_path' => MediaUrl::url($this->photo_path),
            'caption' => $this->caption,
        ];
    }
}
