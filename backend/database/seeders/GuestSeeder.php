<?php

namespace Database\Seeders;

use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Database\Seeder;

class GuestSeeder extends Seeder
{
    public function run(): void
    {
        $invitations = Invitation::where('status', 'published')->get();

        foreach ($invitations as $invitation) {
            if ($invitation->guests()->count() > 0) {
                continue;
            }

            Guest::factory()
                ->count(fake()->numberBetween(5, 8))
                ->create(['invitation_id' => $invitation->id]);
        }
    }
}
