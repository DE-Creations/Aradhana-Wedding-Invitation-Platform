<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('slug')->unique();
            $table->string('template');
            $table->enum('event_type', ['wedding', 'birthday', 'anniversary', 'grand_opening'])->default('wedding');
            $table->enum('status', ['draft', 'published', 'expired'])->default('draft');

            // Couple / Event Host Info
            $table->string('groom_name');
            $table->string('bride_name');
            $table->string('groom_father')->nullable();
            $table->string('groom_mother')->nullable();
            $table->string('bride_father')->nullable();
            $table->string('bride_mother')->nullable();
            $table->string('groom_phone')->nullable();
            $table->string('bride_phone')->nullable();

            // Event Details
            $table->dateTime('ceremony_date');
            $table->string('ceremony_venue');
            $table->string('ceremony_address');
            $table->decimal('ceremony_lat', 10, 8)->nullable();
            $table->decimal('ceremony_lng', 11, 8)->nullable();
            $table->string('reception_venue')->nullable();
            $table->string('reception_address')->nullable();
            $table->dateTime('reception_time')->nullable();
            $table->decimal('reception_lat', 10, 8)->nullable();
            $table->decimal('reception_lng', 11, 8)->nullable();

            // Media
            $table->string('couple_photo')->nullable();
            $table->string('groom_photo')->nullable();
            $table->string('bride_photo')->nullable();
            $table->string('music_url')->nullable();
            $table->text('message')->nullable();

            // Customization
            $table->enum('particle_type', ['rose_petals', 'stars', 'snowflakes', 'confetti', 'none'])->default('rose_petals');
            $table->string('color_primary')->default('#0D0D0D');
            $table->string('color_accent')->default('#C9A96E');
            $table->string('color_rose')->default('#8B3A4A');

            // Tracking
            $table->integer('views_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('event_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
