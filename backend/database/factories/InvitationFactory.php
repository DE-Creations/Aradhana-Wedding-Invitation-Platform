<?php

namespace Database\Factories;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<Invitation>
 */
class InvitationFactory extends Factory
{
    public function definition(): array
    {
        $groom = fake()->firstNameMale();
        $bride = fake()->firstNameFemale();
        $ceremonyDate = Carbon::instance(fake()->dateTimeBetween('+1 month', '+8 months'))->setTime(10, 0);

        return [
            'user_id' => User::factory(),
            // slug auto-generated in the model; leave null to trigger it.
            'slug' => null,
            'template' => fake()->randomElement([
                'royal-wedding', 'golden-classic', 'rose-elegance', 'midnight-luxe',
            ]),
            'event_type' => 'wedding',
            'status' => 'published',

            'groom_name' => "{$groom} " . fake()->lastName(),
            'bride_name' => "{$bride} " . fake()->lastName(),
            'groom_father' => 'Mr. ' . fake()->name('male'),
            'groom_mother' => 'Mrs. ' . fake()->name('female'),
            'bride_father' => 'Mr. ' . fake()->name('male'),
            'bride_mother' => 'Mrs. ' . fake()->name('female'),
            'groom_phone' => fake()->numerify('+9477#######'),
            'bride_phone' => fake()->numerify('+9477#######'),

            'ceremony_date' => $ceremonyDate,
            'ceremony_venue' => fake()->randomElement(["St. Mary's Church", 'Holy Trinity Church', 'Temple of the Tooth']),
            'ceremony_address' => fake()->address(),
            'ceremony_lat' => fake()->latitude(6.7, 7.0),
            'ceremony_lng' => fake()->longitude(79.8, 80.0),
            'reception_venue' => fake()->randomElement(['Grand Ballroom, Cinnamon Grand', 'Shangri-La Colombo', 'Galle Face Hotel']),
            'reception_address' => fake()->address(),
            'reception_time' => (clone $ceremonyDate)->setTime(18, 0),
            'reception_lat' => fake()->latitude(6.7, 7.0),
            'reception_lng' => fake()->longitude(79.8, 80.0),

            'couple_photo' => null,
            'groom_photo' => null,
            'bride_photo' => null,
            'music_url' => null,
            'message' => fake()->randomElement([
                'We would be honored by your presence.',
                'Together with our families, we invite you to celebrate our love.',
                'Join us as we begin our forever.',
            ]),

            'particle_type' => fake()->randomElement(['rose_petals', 'stars', 'snowflakes', 'confetti', 'none']),
            'color_primary' => '#0D0D0D',
            'color_accent' => '#C9A96E',
            'color_rose' => '#8B3A4A',

            'views_count' => fake()->numberBetween(0, 500),
            'published_at' => now(),
            'expires_at' => (clone $ceremonyDate)->addDays(7),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'status' => 'expired',
            'ceremony_date' => now()->subDays(10),
            'expires_at' => now()->subDays(3),
        ]);
    }
}
