<?php

namespace Database\Seeders;

use App\Models\WeddingType;
use Illuminate\Database\Seeder;

class WeddingTypeSeeder extends Seeder
{
    public function run(): void
    {
        WeddingType::firstOrCreate(['id' => 1], ['name' => 'Sinhala Wedding']);
        WeddingType::firstOrCreate(['id' => 2], ['name' => 'Christian Wedding']);
        WeddingType::firstOrCreate(['id' => 3], ['name' => 'Tamil Wedding']);
        WeddingType::firstOrCreate(['id' => 4], ['name' => 'Muslim Wedding']);
        WeddingType::firstOrCreate(['id' => 5], ['name' => 'Homecoming']);
    }
}
