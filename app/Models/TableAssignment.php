<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TableAssignment extends Model
{
    protected $table = 'table_assignments';

    protected $fillable = [
        'wedding_id',
        'table_id',
        'guest_id',
        'assigned_count',
    ];

    public function table(): BelongsTo
    {
        return $this->belongsTo(WeddingTable::class, 'table_id');
    }

    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }
}
