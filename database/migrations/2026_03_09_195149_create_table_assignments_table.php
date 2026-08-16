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
        Schema::create('table_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wedding_id');
            $table->foreignId('table_id');
            $table->foreignId('guest_id');
            $table->unsignedInteger('assigned_count')->default(1);
            $table->timestamps();

            $table->foreign('wedding_id')->references('id')->on('weddings');
            $table->foreign('table_id')->references('id')->on('tables');
            $table->foreign('guest_id')->references('id')->on('guests')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_assignments');
    }
};
