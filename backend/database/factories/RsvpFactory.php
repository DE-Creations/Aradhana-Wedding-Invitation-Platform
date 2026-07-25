<?php

namespace Database\Factories;

use App\Models\Invitation;
use App\Models\Rsvp;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Rsvp>
 */
class RsvpFactory extends Factory
{
    public function definition(): array
    {
        $attendance = fake()->randomElement(['accepted', 'declined']);

        return [
            'invitation_id' => Invitation::factory(),
            'guest_id' => null,
            'guest_name' => fake()->name(),
            'attendance' => $attendance,
            'number_of_guests' => $attendance === 'accepted' ? fake()->numberBetween(1, 4) : 1,
            'dietary_requirements' => $attendance === 'accepted' ? fake()->optional()->randomElement(['Vegetarian', 'Vegan', 'No nuts', 'Halal']) : null,
            'message' => fake()->optional()->sentence(),
            'responded_at' => fake()->dateTimeThisMonth(),
        ];
    }

    public function accepted(): static
    {
        return $this->state(fn () => ['attendance' => 'accepted']);
    }

    public function declined(): static
    {
        return $this->state(fn () => ['attendance' => 'declined', 'number_of_guests' => 1]);
    }
}
