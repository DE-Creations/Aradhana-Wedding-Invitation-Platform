<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::firstOrCreate(
            ['email' => 'admin@aradhana.vip'],
            [
                'name'     => 'Admin',
                'email'    => 'admin@aradhana.vip',
                'password' => bcrypt('admin@321'),
                'phone'    => '0703004483',
            ]
        );
    }
}
