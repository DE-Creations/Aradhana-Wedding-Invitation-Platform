<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Invitation extends Model
{
    /** @use HasFactory<\Database\Factories\InvitationFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'slug',
        'template',
        'event_type',
        'status',
        'groom_name',
        'bride_name',
        'groom_father',
        'groom_mother',
        'bride_father',
        'bride_mother',
        'groom_phone',
        'bride_phone',
        'ceremony_date',
        'ceremony_venue',
        'ceremony_address',
        'ceremony_lat',
        'ceremony_lng',
        'reception_venue',
        'reception_address',
        'reception_time',
        'reception_lat',
        'reception_lng',
        'couple_photo',
        'groom_photo',
        'bride_photo',
        'music_url',
        'message',
        'particle_type',
        'color_primary',
        'color_accent',
        'color_rose',
        'views_count',
        'published_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'ceremony_date' => 'datetime',
            'reception_time' => 'datetime',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
            'ceremony_lat' => 'decimal:8',
            'ceremony_lng' => 'decimal:8',
            'reception_lat' => 'decimal:8',
            'reception_lng' => 'decimal:8',
            'views_count' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Invitation $invitation) {
            if (empty($invitation->slug)) {
                $invitation->slug = static::generateUniqueSlug(
                    $invitation->groom_name,
                    $invitation->bride_name
                );
            }
        });
    }

    /**
     * Build a URL-friendly, unique slug like "vimukthi-and-piumi".
     * Appends -2, -3, ... on collision.
     */
    public static function generateUniqueSlug(string $groomName, string $brideName): string
    {
        // Use only the first name of each side to keep slugs tidy.
        $groom = Str::slug(Str::before(trim($groomName), ' ') ?: $groomName);
        $bride = Str::slug(Str::before(trim($brideName), ' ') ?: $brideName);
        $base = trim("{$groom}-and-{$bride}", '-') ?: Str::random(8);

        $slug = $base;
        $suffix = 2;

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<GalleryPhoto, $this>
     */
    public function galleryPhotos(): HasMany
    {
        return $this->hasMany(GalleryPhoto::class);
    }

    /**
     * @return HasMany<Guest, $this>
     */
    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class);
    }

    /**
     * @return HasMany<Rsvp, $this>
     */
    public function rsvps(): HasMany
    {
        return $this->hasMany(Rsvp::class);
    }

    public function getPublicUrlAttribute(): string
    {
        return rtrim((string) config('app.frontend_url'), '/') . '/i/' . $this->slug;
    }

    /**
     * @param  Builder<Invitation>  $query
     */
    public function scopePublished(Builder $query): void
    {
        $query->where('status', 'published');
    }

    /**
     * @param  Builder<Invitation>  $query
     */
    public function scopeActive(Builder $query): void
    {
        $query->where(function (Builder $q) {
            $q->where('expires_at', '>', now())->orWhereNull('expires_at');
        });
    }
}
