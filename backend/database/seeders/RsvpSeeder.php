<?php

namespace Database\Seeders;

use App\Models\Guest;
use App\Models\Rsvp;
use Illuminate\Database\Seeder;

class RsvpSeeder extends Seeder
{
    public function run(): void
    {
        // Give a portion of existing guests an RSVP (linked to the guest).
        $guests = Guest::with('invitation')->whereDoesntHave('rsvp')->inRandomOrder()->take(8)->get();

        foreach ($guests as $guest) {
            $attendance = fake()->randomElement(['accepted', 'accepted', 'declined']);

            Rsvp::create([
                'invitation_id' => $guest->invitation_id,
                'guest_id' => $guest->id,
                'guest_name' => $guest->name,
                'attendance' => $attendance,
                'number_of_guests' => $attendance === 'accepted' ? fake()->numberBetween(1, 4) : 1,
                'dietary_requirements' => $attendance === 'accepted' ? fake()->optional()->randomElement(['Vegetarian', 'Halal', 'No nuts']) : null,
                'message' => fake()->optional()->sentence(),
                'responded_at' => now()->subDays(fake()->numberBetween(0, 14)),
            ]);
        }
    }
}
