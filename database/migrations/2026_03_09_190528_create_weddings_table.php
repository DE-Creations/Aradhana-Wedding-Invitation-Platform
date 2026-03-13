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
        Schema::create('weddings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->string('event_token')->unique();
            $table->string('bride_name');
            $table->string('groom_name');
            $table->string('bride_parents_names')->nullable();
            $table->string('groom_parents_names')->nullable();
            $table->date('event_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->time('poruwa_time')->nullable();
            $table->string('venue_name');
            $table->text('venue_address')->nullable();
            $table->string('google_maps_link')->nullable();
            $table->date('rsvp_deadline')->nullable();
            $table->string('contact_number_1')->nullable();
            $table->string('contact_number_2')->nullable();
            $table->string('template_key')->nullable();
            $table->string('typography_key')->nullable();
            $table->string('main_image')->nullable();
            $table->enum('status', ['draft', 'active', 'completed'])->default('draft');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weddings');
    }
};
