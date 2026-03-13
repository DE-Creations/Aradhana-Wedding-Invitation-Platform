<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WeddingTable extends Model
{
    protected $table = 'tables';

    public $timestamps = false;

    protected $fillable = [
        'wedding_id',
        'table_name',
        'seat_count',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
        ];
    }

    public function wedding(): BelongsTo
    {
        return $this->belongsTo(Wedding::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TableAssignment::class, 'table_id');
    }

    public function guests(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Guest::class, 'table_assignments', 'table_id', 'guest_id')
                    ->withPivot('assigned_count')
                    ->withTimestamps();
    }
}
