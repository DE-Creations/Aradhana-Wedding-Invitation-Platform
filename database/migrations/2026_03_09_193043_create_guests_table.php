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
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id');
            $table->string('guest_token')->unique();
            $table->string('guest_name');
            $table->string('phone')->nullable();
            $table->unsignedInteger('max_attendees')->default(1);
            $table->enum('rsvp_status', ['pending', 'viewed', 'attending', 'declined'])->default('pending');
            $table->unsignedInteger('attending_count')->nullable();
            $table->timestamp('invitation_opened_at')->nullable();
            $table->timestamp('rsvp_clicked_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->unsignedBigInteger('table_id')->nullable();
            $table->timestamps();

            $table->foreign('wedding_id')->references('id')->on('weddings');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
