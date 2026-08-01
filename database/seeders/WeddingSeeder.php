<?php

namespace Database\Seeders;

use App\Models\Wedding;
use Illuminate\Database\Seeder;

class WeddingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Wedding::firstOrCreate(
            ['id' => 1],
            [
                'user_id'              => 1,
                'event_token'          => 'sample-token-123',
                'bride_name'           => 'Test 1',
                'groom_name'           => 'Test 2',
                'bride_parents_names'  => 'Mr & Mrs Test',
                'groom_parents_names'  => 'Mr & Mrs Test',
                'wedding_type_id'      => 1,
                'contact_number_1'     => '0771234567',
                'contact_number_2'     => '0712345678',
                'template_key'         => 'noir-aurelle',
                'typography_key'       => 'gilded-garamond',
            ]);
    }
}
