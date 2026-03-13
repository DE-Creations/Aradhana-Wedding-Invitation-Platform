<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Guest extends Model
{
    protected $fillable = [
        'wedding_id',
        'guest_token',
        'guest_name',
        'phone',
        'max_attendees',
        'rsvp_status',
        'attending_count',
        'invitation_opened_at',
        'rsvp_clicked_at',
        'responded_at',
        'table_id',
    ];

    protected function casts(): array
    {
        return [
            'invitation_opened_at' => 'datetime',
            'rsvp_clicked_at'      => 'datetime',
            'responded_at'         => 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Guest $guest) {
            if (empty($guest->guest_token)) {
                $guest->guest_token = Str::random(16);
            }
        });
    }

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function table(): BelongsTo
    {
        return $this->belongsTo(WeddingTable::class, 'table_id');
    }
}
