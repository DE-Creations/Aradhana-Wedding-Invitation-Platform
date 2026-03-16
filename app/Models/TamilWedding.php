<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TamilWedding extends Model
{
    protected $table = 'tamil_wedding';

    protected $fillable = [
        'wedding_id',
        'is_muhurtham',
        'muhurtham_event_date',
        'muhurtham_event_venue',
        'muhurtham_start_time',
        'muhurtham_end_time',
        'muhurtham_event_google_maps_link',
        'is_reception',
        'reception_event_date',
        'reception_venue',
        'reception_start_time',
        'reception_event_google_maps_link',
    ];

    protected function casts(): array
    {
        return [
            'muhurtham_event_date' => 'date',
            'reception_event_date' => 'date',
            'is_muhurtham'         => 'boolean',
            'is_reception'         => 'boolean',
        ];
    }

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }
}
