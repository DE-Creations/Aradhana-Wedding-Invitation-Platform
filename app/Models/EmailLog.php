<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailLog extends Model
{
    public const TYPE_WELCOME          = 'welcome';
    public const TYPE_BIG_DAY_WISHES   = 'big_day_wishes';
    public const TYPE_EXPIRY_REMINDER  = 'expiry_reminder';

    protected $fillable = [
        'user_id',
        'type',
        'sent_at',
    ];

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Return true if an email of the given type has already been sent to this user.
     */
    public static function alreadySent(int $userId, string $type): bool
    {
        return static::where('user_id', $userId)
            ->where('type', $type)
            ->exists();
    }

    /**
     * Record that an email was sent.
     */
    public static function record(int $userId, string $type): static
    {
        return static::create([
            'user_id' => $userId,
            'type'    => $type,
            'sent_at' => now(),
        ]);
    }

    /**
     * Delete the log entry for a given user + type so the email can be re-sent.
     * Used when a scheduled date (expiry or event) changes.
     */
    public static function clearFor(int $userId, string $type): void
    {
        static::where('user_id', $userId)
            ->where('type', $type)
            ->delete();
    }
}
