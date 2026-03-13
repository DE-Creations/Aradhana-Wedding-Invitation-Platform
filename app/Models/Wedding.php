<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'event_date',
        'start_time',
        'end_time',
        'poruwa_time',
        'venue_name',
        'venue_address',
        'google_maps_link',
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
            'event_date' => 'date',
            'rsvp_deadline' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
