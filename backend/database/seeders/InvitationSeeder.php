<?php

namespace Database\Seeders;

use App\Models\GalleryPhoto;
use App\Models\Invitation;
use App\Models\User;
use Illuminate\Database\Seeder;

class InvitationSeeder extends Seeder
{
    public function run(): void
    {
        $user1 = User::where('email', 'user1@aradhana.test')->first();
        $user2 = User::where('email', 'user2@aradhana.test')->first();

        if (! $user1 || ! $user2) {
            return;
        }

        // A flagship published wedding with a fixed slug for easy testing.
        $flagship = Invitation::updateOrCreate(
            ['slug' => 'vimukthi-and-piumi'],
            [
                'user_id' => $user1->id,
                'template' => 'royal-wedding',
                'event_type' => 'wedding',
                'status' => 'published',
                'groom_name' => 'Vimukthi Perera',
                'bride_name' => 'Piumi Fernando',
                'groom_father' => 'Mr. Kamal Perera',
                'groom_mother' => 'Mrs. Nilanthi Perera',
                'bride_father' => 'Mr. Saman Fernando',
                'bride_mother' => 'Mrs. Kumari Fernando',
                'groom_phone' => '+94771234567',
                'bride_phone' => '+94779876543',
                'ceremony_date' => now()->addMonths(2)->setTime(10, 0),
                'ceremony_venue' => "St. Mary's Church",
                'ceremony_address' => '123 Church Road, Colombo 07',
                'ceremony_lat' => 6.9147,
                'ceremony_lng' => 79.8624,
                'reception_venue' => 'Grand Ballroom, Cinnamon Grand',
                'reception_address' => '77 Galle Road, Colombo 03',
                'reception_time' => now()->addMonths(2)->setTime(18, 0),
                'reception_lat' => 6.9167,
                'reception_lng' => 79.8487,
                'message' => 'We would be honored by your presence.',
                'particle_type' => 'rose_petals',
                'color_primary' => '#0D0D0D',
                'color_accent' => '#C9A96E',
                'color_rose' => '#8B3A4A',
                'views_count' => 128,
                'published_at' => now(),
                'expires_at' => now()->addMonths(2)->addDays(7),
            ]
        );

        // Gallery photos for the flagship invitation.
        if ($flagship->galleryPhotos()->count() === 0) {
            foreach ([
                ['photo_path' => 'photos/gallery/sample-1.jpg', 'caption' => 'Our first date', 'sort_order' => 1],
                ['photo_path' => 'photos/gallery/sample-2.jpg', 'caption' => 'The proposal', 'sort_order' => 2],
                ['photo_path' => 'photos/gallery/sample-3.jpg', 'caption' => 'Engagement day', 'sort_order' => 3],
            ] as $photo) {
                GalleryPhoto::create(['invitation_id' => $flagship->id] + $photo);
            }
        }

        // A draft + an additional published one for the second user.
        Invitation::factory()->draft()->create([
            'user_id' => $user2->id,
            'groom_name' => 'Nuwan Silva',
            'bride_name' => 'Ama Jayasuriya',
        ]);

        Invitation::factory()->create([
            'user_id' => $user2->id,
            'groom_name' => 'Kasun Bandara',
            'bride_name' => 'Dilini Rathnayake',
        ]);
    }
}
