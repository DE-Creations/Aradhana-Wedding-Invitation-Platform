<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'test@gmail.com'],
            [
                'name'        => 'Test User',
                'email'       => 'test@gmail.com',
                'password'    => bcrypt('test@321'),
                'phone'       => '0773488696',
                'status'      => 'active',
                'expire_date' => now()->addYear(),
            ]
        );
    }
}
