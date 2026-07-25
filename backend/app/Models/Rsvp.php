<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rsvp extends Model
{
    /** @use HasFactory<\Database\Factories\RsvpFactory> */
    use HasFactory;

    protected $fillable = [
        'invitation_id',
        'guest_id',
        'guest_name',
        'attendance',
        'number_of_guests',
        'dietary_requirements',
        'message',
        'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'responded_at' => 'datetime',
            'number_of_guests' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Rsvp $rsvp) {
            if (empty($rsvp->responded_at)) {
                $rsvp->responded_at = now();
            }
        });
    }

    /**
     * @return BelongsTo<Invitation, $this>
     */
    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    /**
     * @return BelongsTo<Guest, $this>
     */
    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }
}
