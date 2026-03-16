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
        Schema::create('muslim_wedding', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('wedding_id');

            $table->boolean('is_nikkah')->default(false);
            $table->date('nikkah_event_date')->nullable();
            $table->string('nikkah_event_venue')->nullable();
            $table->string('nikkah_event_google_maps_link', 2048)->nullable();
            $table->time('nikkah_start_time')->nullable();

            $table->boolean('is_reception')->default(false);
            $table->date('reception_event_date')->nullable();
            $table->string('reception_venue')->nullable();
            $table->string('reception_event_google_maps_link', 2048)->nullable();
            $table->time('reception_start_time')->nullable();

            $table->timestamps();

            $table->foreign('wedding_id')->references('id')->on('weddings');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('muslim_wedding');
    }
};
