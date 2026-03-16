<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MuslimWedding extends Model
{
    protected $table = 'muslim_wedding';

    protected $fillable = [
        'wedding_id',
        'is_nikkah',
        'nikkah_event_date',
        'nikkah_event_venue',
        'nikkah_start_time',
        'nikkah_event_google_maps_link',
        'is_reception',
        'reception_event_date',
        'reception_venue',
        'reception_start_time',
        'reception_event_google_maps_link',
    ];

    protected function casts(): array
    {
        return [
            'nikkah_event_date'    => 'date',
            'reception_event_date' => 'date',
            'is_nikkah'            => 'boolean',
            'is_reception'         => 'boolean',
        ];
    }

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }
}
