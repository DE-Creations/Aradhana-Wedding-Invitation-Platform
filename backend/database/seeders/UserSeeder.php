<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@aradhana.test'],
            [
                'name' => 'Platform Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone' => '+94770000000',
                'subscription_plan' => 'premium',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'user1@aradhana.test'],
            [
                'name' => 'Vimukthi Perera',
                'password' => Hash::make('password'),
                'role' => 'user',
                'phone' => '+94771111111',
                'subscription_plan' => 'premium',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'user2@aradhana.test'],
            [
                'name' => 'Saman Fernando',
                'password' => Hash::make('password'),
                'role' => 'user',
                'phone' => '+94772222222',
                'subscription_plan' => 'basic',
                'email_verified_at' => now(),
            ]
        );
    }
}
