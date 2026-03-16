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
        Schema::create('christian_wedding', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('wedding_id');
            $table->boolean('is_church_ceremony')->default(false);
            $table->date('church_event_date')->nullable();
            $table->string('church_venue')->nullable();
            $table->string('church_event_google_maps_link', 2048)->nullable();
            $table->time('ceremony_time')->nullable();

            $table->boolean('is_reception')->default(false);
            $table->date('reception_event_date')->nullable();
            $table->string('reception_venue')->nullable();
            $table->string('reception_event_google_maps_link', 2048)->nullable();
            $table->time('reception_start_time')->nullable();
            $table->time('reception_end_time')->nullable();
            $table->timestamps();

            $table->foreign('wedding_id')->references('id')->on('weddings');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('christian_wedding');
    }
};
