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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone');
            $table->unsignedBigInteger('ceremony_type_id')->nullable();
            $table->integer('image_count')->default(0);
            $table->boolean('table_management')->default(false);
            $table->boolean('share_memory')->default(false);
            $table->enum('status', ['active', 'deactive', 'expired'])->default('active');
            $table->timestamp('expire_date')->nullable();
            $table->timestamps();

            $table->foreign('ceremony_type_id')->references('id')->on('ceremony_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
