<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * The typography choices were rebuilt into Basic / Professional / Fancy /
     * Modern / Artistic pairings. Move weddings that saved one of the previous
     * six keys onto the closest new pairing; null/unknown keys fall back to the
     * app default when rendered.
     */
    private const MAP = [
        'enchanted-script'   => 'fancy-great-vibes-playfair',
        'gilded-garamond'    => 'professional-cinzel-lora',
        'imperial-roman'     => 'professional-cinzel-lora',
        'playfair-prestige'  => 'professional-playfair-montserrat',
        'garamond-editorial' => 'professional-playfair-montserrat',
        'lora-whisper'       => 'basic-lora-lato',
    ];

    public function up(): void
    {
        foreach (self::MAP as $old => $new) {
            DB::table('weddings')
                ->where('typography_key', $old)
                ->update(['typography_key' => $new]);
        }
    }

    public function down(): void
    {
        // Several old keys collapse onto one new key, so the original value cannot be recovered.
    }
};
