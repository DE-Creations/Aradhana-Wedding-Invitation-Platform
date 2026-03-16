<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sinhala_wedding', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('wedding_id');
            $table->date('event_date');
            $table->string('venue');
            $table->string('google_maps_link', 2048)->nullable();
            $table->time('start_time');
            $table->time('poruwa_time');
            $table->time('end_time')->nullable();
            $table->timestamps();

            $table->foreign('wedding_id')->references('id')->on('weddings');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sinhala_wedding');
    }
};
