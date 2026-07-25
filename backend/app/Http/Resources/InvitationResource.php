<?php

namespace App\Http\Resources;

use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

/**
 * @mixin \App\Models\Invitation
 */
class InvitationResource extends JsonResource
{
    protected ?\App\Models\Guest $guestContext = null;

    /**
     * Attach a guest so guest-specific data is included in the payload.
     */
    public function withGuest(?\App\Models\Guest $guest): static
    {
        $this->guestContext = $guest;

        return $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'template' => $this->template,
            'event_type' => $this->event_type,
            'status' => $this->status,

            'groom_name' => $this->groom_name,
            'bride_name' => $this->bride_name,
            'groom_father' => $this->groom_father,
            'groom_mother' => $this->groom_mother,
            'bride_father' => $this->bride_father,
            'bride_mother' => $this->bride_mother,

            'ceremony_date' => optional($this->ceremony_date)->toIso8601String(),
            'ceremony_venue' => $this->ceremony_venue,
            'ceremony_address' => $this->ceremony_address,
            'ceremony_lat' => $this->when(! is_null($this->ceremony_lat), fn () => (float) $this->ceremony_lat),
            'ceremony_lng' => $this->when(! is_null($this->ceremony_lng), fn () => (float) $this->ceremony_lng),

            'reception_venue' => $this->reception_venue,
            'reception_address' => $this->reception_address,
            'reception_time' => optional($this->reception_time)->toIso8601String(),
            'reception_lat' => $this->when(! is_null($this->reception_lat), fn () => (float) $this->reception_lat),
            'reception_lng' => $this->when(! is_null($this->reception_lng), fn () => (float) $this->reception_lng),

            'groom_phone' => $this->groom_phone,
            'bride_phone' => $this->bride_phone,

            'groom_photo' => MediaUrl::url($this->groom_photo),
            'bride_photo' => MediaUrl::url($this->bride_photo),
            'couple_photo' => MediaUrl::url($this->couple_photo),

            'gallery_photos' => GalleryPhotoResource::collection($this->whenLoaded('galleryPhotos')),

            'music_url' => MediaUrl::url($this->music_url),
            'message' => $this->message,
            'particle_type' => $this->particle_type,

            'colors' => [
                'primary' => $this->color_primary,
                'accent' => $this->color_accent,
                'rose' => $this->color_rose,
            ],

            'views_count' => $this->views_count,
            'days_until_event' => $this->daysUntilEvent(),
            'google_calendar_url' => $this->googleCalendarUrl(),
            'ceremony_map_url' => $this->mapUrl($this->ceremony_lat, $this->ceremony_lng, $this->ceremony_address),
            'reception_map_url' => $this->mapUrl($this->reception_lat, $this->reception_lng, $this->reception_address),

            'guest' => $this->when($this->guestContext !== null, fn () => $this->guestData()),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function guestData(): array
    {
        $guest = $this->guestContext;
        $rsvp = $guest?->rsvp;

        return [
            'name' => $guest?->name,
            'token' => $guest?->token,
            'has_rsvped' => $rsvp !== null,
            'rsvp' => $rsvp ? [
                'attendance' => $rsvp->attendance,
                'number_of_guests' => $rsvp->number_of_guests,
                'dietary_requirements' => $rsvp->dietary_requirements,
                'message' => $rsvp->message,
            ] : null,
        ];
    }

    private function daysUntilEvent(): ?int
    {
        if (! $this->ceremony_date) {
            return null;
        }

        return max(0, now()->startOfDay()->diffInDays($this->ceremony_date->copy()->startOfDay(), false));
    }

    private function googleCalendarUrl(): ?string
    {
        if (! $this->ceremony_date) {
            return null;
        }

        $start = $this->ceremony_date->copy()->utc();
        $end = ($this->reception_time?->copy()->utc()) ?? $start->copy()->addHours(3);

        $params = http_build_query([
            'action' => 'TEMPLATE',
            'text' => "{$this->groom_name} & {$this->bride_name} Wedding",
            'dates' => $start->format('Ymd\THis\Z') . '/' . $end->format('Ymd\THis\Z'),
            'details' => (string) $this->message,
            'location' => $this->ceremony_venue . ', ' . $this->ceremony_address,
        ]);

        return "https://calendar.google.com/calendar/render?{$params}";
    }

    private function mapUrl($lat, $lng, ?string $address): ?string
    {
        if (! is_null($lat) && ! is_null($lng)) {
            return 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode("{$lat},{$lng}");
        }

        if (! blank($address)) {
            return 'https://www.google.com/maps/search/?api=1&query=' . rawurlencode($address);
        }

        return null;
    }
}
