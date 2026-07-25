<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Note: model events are intentionally NOT disabled here because slug and
     * guest-token auto-generation relies on the models' "creating" events.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            InvitationSeeder::class,
            GuestSeeder::class,
            RsvpSeeder::class,
        ]);
    }
}
