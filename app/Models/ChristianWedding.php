<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChristianWedding extends Model
{
    protected $table = 'christian_wedding';

    protected $fillable = [
        'wedding_id',
        'is_church_ceremony',
        'church_event_date',
        'church_venue',
        'ceremony_time',
        'church_event_google_maps_link',
        'is_reception',
        'reception_event_date',
        'reception_venue',
        'reception_start_time',
        'reception_end_time',
        'reception_event_google_maps_link',
    ];

    protected function casts(): array
    {
        return [
            'church_event_date'    => 'date',
            'reception_event_date' => 'date',
            'is_church_ceremony'   => 'boolean',
            'is_reception'         => 'boolean',
        ];
    }

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }
}
