<?php

namespace Database\Seeders;

use App\Models\CeremonyType;
use Illuminate\Database\Seeder;

class CeremonyTypeSeeder extends Seeder
{
    public function run(): void
    {
        CeremonyType::firstOrCreate(['id' => 1], ['name' => 'Poruwa Ceremony']);
        CeremonyType::firstOrCreate(['id' => 2], ['name' => 'Church Ceremony']);
        CeremonyType::firstOrCreate(['id' => 3], ['name' => 'Muhurtham']);
        CeremonyType::firstOrCreate(['id' => 4], ['name' => 'Nikah']);
    }
}
