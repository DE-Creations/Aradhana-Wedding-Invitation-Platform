<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Guest extends Model
{
    /** @use HasFactory<\Database\Factories\GuestFactory> */
    use HasFactory;

    protected $fillable = [
        'invitation_id',
        'name',
        'email',
        'phone',
        'token',
        'invitation_sent',
        'invitation_sent_at',
        'reminder_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'invitation_sent' => 'boolean',
            'invitation_sent_at' => 'datetime',
            'reminder_sent_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Guest $guest) {
            if (empty($guest->token)) {
                $guest->token = static::generateUniqueToken();
            }
        });
    }

    public static function generateUniqueToken(): string
    {
        do {
            $token = Str::random(32);
        } while (static::where('token', $token)->exists());

        return $token;
    }

    /**
     * @return BelongsTo<Invitation, $this>
     */
    public function invitation(): BelongsTo
    {
        return $this->belongsTo(Invitation::class);
    }

    /**
     * @return HasOne<Rsvp, $this>
     */
    public function rsvp(): HasOne
    {
        return $this->hasOne(Rsvp::class);
    }

    public function getPersonalizedUrlAttribute(): string
    {
        $base = rtrim((string) config('app.frontend_url'), '/');

        return "{$base}/i/{$this->invitation->slug}/g/{$this->token}";
    }
}
