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
        Schema::create('rsvps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id');
            $table->foreignId('guest_id');
            $table->boolean('attending');
            $table->unsignedInteger('attending_count')->nullable();
            $table->text('note')->nullable();
            $table->timestamp('responded_at');
            $table->timestamps();

            $table->foreign('wedding_id')->references('id')->on('weddings');
            $table->foreign('guest_id')->references('id')->on('guests')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rsvps');
    }
};
