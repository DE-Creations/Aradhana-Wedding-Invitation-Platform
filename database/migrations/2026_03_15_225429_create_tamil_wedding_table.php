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
        Schema::create('tamil_wedding', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('wedding_id');
            $table->boolean('is_muhurtham')->default(false);
            $table->date('muhurtham_event_date')->nullable();
            $table->string('muhurtham_event_venue')->nullable();
            $table->string('muhurtham_event_google_maps_link', 2048)->nullable();
            $table->time('muhurtham_start_time')->nullable();
            $table->time('muhurtham_end_time')->nullable();

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
        Schema::dropIfExists('tamil_wedding');
    }
};
