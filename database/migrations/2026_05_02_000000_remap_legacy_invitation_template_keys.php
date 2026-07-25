<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Remap now-removed template & typography keys on existing weddings to the
     * nearest new design so previously-created invitations keep their intent
     * after the designs overhaul.
     */
    public function up(): void
    {
        $templateMap = [
            // Removed solid -> nearest new solid palette
            'rose-reverie'       => 'blush-atelier',
            'petal-romance'      => 'blush-atelier',
            'coral-drift'        => 'blush-atelier',
            'saffron-bloom'      => 'blush-atelier',
            'crimson-velvet'     => 'blush-atelier',
            'blossom-glory'      => 'blush-atelier',
            'moonstone-bliss'    => 'sage-botanica',
            'verdant-whisper'    => 'sage-botanica',
            'garden-arch'        => 'sage-botanica',
            'lily-lagoon'        => 'azure-lumiere',
            'pearl-mist'         => 'azure-lumiere',
            'midnight-celestial' => 'noir-aurelle',
            'indigo-royale'      => 'noir-aurelle',
            'minimal-vow'        => 'noir-aurelle',
            'amber-harvest'      => 'noir-aurelle',
            'velvet-dusk'        => 'plum-velvet',
            'wisteria-dreams'    => 'plum-velvet',
            // Removed animated -> nearest new animated
            'celestial-cosmos'   => 'celestial-nocturne',
            'moonlit-romance'    => 'celestial-nocturne',
            'cherry-blossom-fall' => 'petal-waltz',
            'golden-dust'        => 'ink-and-gold',
            'emerald-vine'       => 'golden-filigree',
            // legacy generic
            'classic'            => 'faded-picture-overlay',
        ];

        $typographyMap = [
            'classic'       => 'gilded-garamond',
            'classic-grace' => 'gilded-garamond',
            'elegant'       => 'enchanted-script',
        ];

        $animatedKeys = ['ink-and-gold', 'celestial-nocturne', 'petal-waltz', 'liquid-bloom', 'golden-filigree'];

        foreach ($templateMap as $old => $new) {
            $category = in_array($new, $animatedKeys, true) ? 'animated' : 'solid';
            DB::table('weddings')
                ->where('template_key', $old)
                ->update([
                    'template_key'      => $new,
                    'template_category' => $category,
                ]);
        }

        foreach ($typographyMap as $old => $new) {
            DB::table('weddings')
                ->where('typography_key', $old)
                ->update(['typography_key' => $new]);
        }
    }

    public function down(): void
    {
        // One-way data cleanup; no rollback.
    }
};
