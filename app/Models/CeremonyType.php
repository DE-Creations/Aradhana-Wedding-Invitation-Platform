<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CeremonyType extends Model
{
    protected $fillable = [
        'name',
        'is_active',
    ];
}
