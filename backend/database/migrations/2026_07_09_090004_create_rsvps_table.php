<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rsvps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('guest_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('guest_name');
            $table->enum('attendance', ['accepted', 'declined']);
            $table->integer('number_of_guests')->default(1);
            $table->text('dietary_requirements')->nullable();
            $table->text('message')->nullable();
            $table->timestamp('responded_at');
            $table->timestamps();

            $table->index('invitation_id');
            $table->index('attendance');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rsvps');
    }
};
