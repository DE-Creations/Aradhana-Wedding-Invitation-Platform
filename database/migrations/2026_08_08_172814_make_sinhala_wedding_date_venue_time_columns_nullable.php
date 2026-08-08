<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE sinhala_wedding MODIFY event_date DATE NULL');
        DB::statement('ALTER TABLE sinhala_wedding MODIFY venue VARCHAR(255) NULL');
        DB::statement('ALTER TABLE sinhala_wedding MODIFY start_time TIME NULL');
        DB::statement('ALTER TABLE sinhala_wedding MODIFY poruwa_time TIME NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE sinhala_wedding MODIFY event_date DATE NOT NULL');
        DB::statement('ALTER TABLE sinhala_wedding MODIFY venue VARCHAR(255) NOT NULL');
        DB::statement('ALTER TABLE sinhala_wedding MODIFY start_time TIME NOT NULL');
        DB::statement('ALTER TABLE sinhala_wedding MODIFY poruwa_time TIME NOT NULL');
    }
};
