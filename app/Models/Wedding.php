<?php

namespace App\Models;

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
        'typography_key',
        'main_image',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'rsvp_deadline' => 'date',
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
}
