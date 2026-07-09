<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('weddings', function (Blueprint $table) {
            $table->string('template_category', 32)->default('solid')->after('template_key');
            $table->string('background_music_path')->nullable()->after('main_image');
            $table->string('background_music_label')->nullable()->after('background_music_path');
            $table->boolean('background_music_enabled')->default(true)->after('background_music_label');
        });
    }

    public function down(): void
    {
        Schema::table('weddings', function (Blueprint $table) {
            $table->dropColumn([
                'template_category',
                'background_music_path',
                'background_music_label',
                'background_music_enabled',
            ]);
        });
    }
};
