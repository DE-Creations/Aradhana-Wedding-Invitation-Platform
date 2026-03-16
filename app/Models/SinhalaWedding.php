<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SinhalaWedding extends Model
{
    protected $table = 'sinhala_wedding';

    protected $fillable = [
        'wedding_id',
        'event_date',
        'venue',
        'start_time',
        'poruwa_time',
        'end_time',
        'google_maps_link',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
        ];
    }

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }
}
