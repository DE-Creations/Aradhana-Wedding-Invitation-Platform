<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rsvp extends Model
{
    protected $fillable = [
        'wedding_id',
        'guest_id',
        'attending',
        'attending_count',
        'note',
        'responded_at',
    ];

    protected function casts(): array
    {
        return [
            'attending'    => 'boolean',
            'responded_at' => 'datetime',
        ];
    }

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }
}
