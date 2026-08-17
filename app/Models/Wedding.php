<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Wedding extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_token',
        'bride_name',
        'groom_name',
        'bride_parents_names',
        'groom_parents_names',
        'wedding_type_id',
        'rsvp_deadline',
        'contact_number_1',
        'contact_number_2',
        'template_key',
        'template_category',
        'typography_key',
        'main_image',
        'background_music_path',
        'background_music_label',
        'background_music_enabled',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'rsvp_deadline'            => 'date',
            'background_music_enabled' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function weddingType(): BelongsTo
    {
        return $this->belongsTo(WeddingType::class);
    }

    public function sinhalaDetails(): HasOne
    {
        return $this->hasOne(SinhalaWedding::class);
    }

    public function christianDetails(): HasOne
    {
        return $this->hasOne(ChristianWedding::class);
    }

    public function tamilDetails(): HasOne
    {
        return $this->hasOne(TamilWedding::class);
    }

    public function muslimDetails(): HasOne
    {
        return $this->hasOne(MuslimWedding::class);
    }

    public function homecomingDetails(): HasOne
    {
        return $this->hasOne(HomecomingWedding::class);
    }

    public function galleryImages(): HasMany
    {
        return $this->hasMany(WeddingGalleryImage::class);
    }

    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class);
    }

    public function tables(): HasMany
    {
        return $this->hasMany(WeddingTable::class);
    }

    public function memories(): HasMany
    {
        return $this->hasMany(Memory::class);
    }

    /**
     * Return the primary event date for this wedding regardless of type.
     *
     * Logic:
     *  - Sinhala  → sinhala_wedding.event_date
     *  - Christian → church_event_date (falls back to reception_event_date)
     *  - Tamil     → muhurtham_event_date (falls back to reception_event_date)
     *  - Muslim    → nikkah_event_date (falls back to reception_event_date)
     *  - Homecoming → event_date
     */
    public function primaryEventDate(): ?Carbon
    {
        if ($this->sinhalaDetails) {
            return $this->sinhalaDetails->event_date instanceof Carbon
                ? $this->sinhalaDetails->event_date
                : ($this->sinhalaDetails->event_date
                    ? Carbon::parse($this->sinhalaDetails->event_date) : null);
        }

        if ($this->christianDetails) {
            $date = $this->christianDetails->church_event_date
                ?? $this->christianDetails->reception_event_date;
            return $date ? Carbon::parse($date) : null;
        }

        if ($this->tamilDetails) {
            $date = $this->tamilDetails->muhurtham_event_date
                ?? $this->tamilDetails->reception_event_date;
            return $date ? Carbon::parse($date) : null;
        }

        if ($this->muslimDetails) {
            $date = $this->muslimDetails->nikkah_event_date
                ?? $this->muslimDetails->reception_event_date;
            return $date ? Carbon::parse($date) : null;
        }

        if ($this->homecomingDetails) {
            return $this->homecomingDetails->event_date instanceof Carbon
                ? $this->homecomingDetails->event_date
                : ($this->homecomingDetails->event_date
                    ? Carbon::parse($this->homecomingDetails->event_date) : null);
        }

        return null;
    }
}
