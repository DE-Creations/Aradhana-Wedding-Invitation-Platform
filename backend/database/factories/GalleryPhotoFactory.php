<?php

namespace Database\Factories;

use App\Models\GalleryPhoto;
use App\Models\Invitation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GalleryPhoto>
 */
class GalleryPhotoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'invitation_id' => Invitation::factory(),
            'photo_path' => 'photos/gallery/' . fake()->uuid() . '.jpg',
            'caption' => fake()->optional()->sentence(3),
            'sort_order' => fake()->numberBetween(0, 20),
        ];
    }
}
