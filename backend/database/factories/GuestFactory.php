<?php

namespace Database\Factories;

use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Guest>
 */
class GuestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'invitation_id' => Invitation::factory(),
            'name' => fake()->name(),
            'email' => fake()->optional()->safeEmail(),
            'phone' => fake()->optional()->numerify('+9477#######'),
            // token auto-generated in the model; leave null to trigger it.
            'token' => null,
            'invitation_sent' => fake()->boolean(60),
            'invitation_sent_at' => fake()->optional()->dateTimeThisMonth(),
            'reminder_sent_at' => null,
        ];
    }
}
