<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\InvitationView;
use App\Models\Rsvp;
use App\Models\Wedding;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicInvitationController extends Controller
{
    public function show(Request $request, string $token)
    {
        $wedding = Wedding::where('event_token', $token)
            ->where('status', '!=', 'draft')
            ->with(['weddingType', 'sinhalaDetails', 'christianDetails', 'tamilDetails', 'muslimDetails'])
            ->firstOrFail();

        $guestToken = $request->query('guest');
        $guest = null;
        if ($guestToken) {
            $guest = Guest::where('guest_token', $guestToken)
                ->where('wedding_id', $wedding->id)
                ->first();
        }

        // Track invitation opened — skip link-preview bots/crawlers (e.g. WhatsApp)
        if ($guest && ! $this->isLinkPreviewBot($request)) {
            if (! $guest->invitation_opened_at) {
                $guest->update([
                    'invitation_opened_at' => now(),
                    'rsvp_status'          => 'viewed',
                ]);
            }
            InvitationView::create([
                'wedding_id' => $wedding->id,
                'guest_id'   => $guest->id,
                'event_type' => 'opened',
                'ip_address' => $request->ip(),
            ]);
        }

        $galleryImages = $wedding->galleryImages()
            ->orderBy('sort_order')
            ->get()
            ->map(fn ($img) => asset('storage/' . $img->image_path))
            ->values()
            ->toArray();

        return Inertia::render('public/Invitation', [
            'wedding' => [
                'bride_name'               => $wedding->bride_name,
                'groom_name'               => $wedding->groom_name,
                'bride_parents_names'      => $wedding->bride_parents_names,
                'groom_parents_names'      => $wedding->groom_parents_names,
                'wedding_type_id'          => (string) ($wedding->wedding_type_id ?? ''),
                'rsvp_deadline'            => $wedding->rsvp_deadline?->toDateString(),
                'contact_number_1'         => $wedding->contact_number_1,
                'contact_number_2'         => $wedding->contact_number_2,
                'template_key'             => $wedding->template_key ?? 'faded-picture-overlay',
                'typography_key'           => $wedding->typography_key ?? 'gilded-garamond',
                'background_music_url'     => $wedding->background_music_path
                    ? asset('storage/' . $wedding->background_music_path)
                    : null,
                'background_music_label'   => $wedding->background_music_label,
                'background_music_enabled' => (bool) $wedding->background_music_enabled,
            ],
            'ceremonyEvents'     => $this->buildCeremonyEvents($wedding),
            'googleMapsLink'     => null,
            'guest' => $guest ? [
                'id'            => $guest->id,
                'guest_name'    => $guest->guest_name,
                'guest_token'   => $guest->guest_token,
                'max_attendees' => $guest->max_attendees,
                'rsvp_status'   => $guest->rsvp_status,
            ] : null,
            'eventToken'          => $wedding->event_token,
            'coupleMainImage'     => $wedding->main_image ? asset('storage/' . $wedding->main_image) : null,
            'coupleGalleryImages' => $galleryImages,
        ]);
    }

    public function submitRsvp(Request $request, string $token): JsonResponse
    {
        $wedding = Wedding::where('event_token', $token)->firstOrFail();

        $validated = $request->validate([
            'guest_token'    => 'required|string',
            'attending'      => 'required|boolean',
            'attending_count' => 'nullable|integer|min:1|max:20',
            'note'           => 'nullable|string|max:500',
        ]);

        $guest = Guest::where('guest_token', $validated['guest_token'])
            ->where('wedding_id', $wedding->id)
            ->firstOrFail();

        $attending      = $validated['attending'];
        $attendingCount = $attending ? ($validated['attending_count'] ?? 1) : null;

        $guest->update([
            'rsvp_status'    => $attending ? 'attending' : 'declined',
            'attending_count' => $attendingCount,
            'responded_at'   => now(),
        ]);

        Rsvp::updateOrCreate(
            ['wedding_id' => $wedding->id, 'guest_id' => $guest->id],
            [
                'attending'       => $attending,
                'attending_count' => $attendingCount,
                'note'            => $validated['note'] ?? null,
                'responded_at'    => now(),
            ]
        );

        InvitationView::create([
            'wedding_id' => $wedding->id,
            'guest_id'   => $guest->id,
            'event_type' => 'submitted',
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['success' => true]);
    }

    public function trackRsvpClick(Request $request, string $token): JsonResponse
    {
        $wedding = Wedding::where('event_token', $token)->firstOrFail();

        $guestToken = $request->input('guest_token');
        if (!$guestToken) {
            return response()->json(['success' => false], 422);
        }

        $guest = Guest::where('guest_token', $guestToken)
            ->where('wedding_id', $wedding->id)
            ->first();

        if (!$guest) {
            return response()->json(['success' => false], 404);
        }

        if (!$guest->rsvp_clicked_at) {
            $guest->update(['rsvp_clicked_at' => now()]);
        }

        InvitationView::create([
            'wedding_id' => $wedding->id,
            'guest_id'   => $guest->id,
            'event_type' => 'rsvp_clicked',
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['success' => true]);
    }

    /**
     * Returns true when the request is from a link-preview crawler/bot rather
     * than a real interactive browser visit. Prevents WhatsApp & similar
     * services from triggering false invitation-view records.
     */
    private function isLinkPreviewBot(Request $request): bool
    {
        $ua = strtolower($request->userAgent() ?? '');

        $signatures = [
            'facebookexternalhit', // WhatsApp / Facebook link preview
            'facebot',             // Facebook bot
            'whatsapp',            // WhatsApp
            'twitterbot',          // Twitter card fetcher
            'slackbot',            // Slack
            'slack-imgproxy',
            'telegrambot',         // Telegram
            'linkedinbot',         // LinkedIn
            'discordbot',          // Discord
            'applebot',            // Apple
            'pinterest',           // Pinterest
            'googlebot',           // Google
            'bingbot',             // Bing
            'ia_archiver',         // Wayback Machine
            'curl/',
            'wget/',
            'python-requests',
            'go-http-client',
            'okhttp',
            'java/',
        ];

        foreach ($signatures as $sig) {
            if (str_contains($ua, $sig)) {
                return true;
            }
        }

        return false;
    }

    private function buildCeremonyEvents(Wedding $wedding): array
    {
        $events = [];

        switch ((int) $wedding->wedding_type_id) {
            case 1: // Sinhala
                $d = $wedding->sinhalaDetails;
                if ($d) {
                    $events[] = [
                        'label'            => 'Wedding Ceremony',
                        'date'             => $d->event_date?->toDateString() ?? '',
                        'venue'            => $d->venue ?? '',
                        'start_time'       => $d->start_time ?? '',
                        'end_time'         => $d->end_time ?? '',
                        'poruwa_time'      => $d->poruwa_time ?? '',
                        'google_maps_link' => $d->google_maps_link ?? '',
                    ];
                }
                break;

            case 2: // Christian
                $d = $wedding->christianDetails;
                if ($d) {
                    if ($d->is_church_ceremony) {
                        $events[] = [
                            'label'            => 'Church Ceremony',
                            'date'             => $d->church_event_date?->toDateString() ?? '',
                            'venue'            => $d->church_venue ?? '',
                            'start_time'       => $d->ceremony_time ?? '',
                            'end_time'         => '',
                            'google_maps_link' => $d->church_event_google_maps_link ?? '',
                        ];
                    }
                    if ($d->is_reception) {
                        $events[] = [
                            'label'            => 'Reception',
                            'date'             => $d->reception_event_date?->toDateString() ?? '',
                            'venue'            => $d->reception_venue ?? '',
                            'start_time'       => $d->reception_start_time ?? '',
                            'end_time'         => $d->reception_end_time ?? '',
                            'google_maps_link' => $d->reception_event_google_maps_link ?? '',
                        ];
                    }
                }
                break;

            case 3: // Tamil
                $d = $wedding->tamilDetails;
                if ($d) {
                    if ($d->is_muhurtham) {
                        $events[] = [
                            'label'            => 'Muhurtham Ceremony',
                            'date'             => $d->muhurtham_event_date?->toDateString() ?? '',
                            'venue'            => $d->muhurtham_event_venue ?? '',
                            'start_time'       => $d->muhurtham_start_time ?? '',
                            'end_time'         => $d->muhurtham_end_time ?? '',
                            'google_maps_link' => $d->muhurtham_event_google_maps_link ?? '',
                        ];
                    }
                    if ($d->is_reception) {
                        $events[] = [
                            'label'            => 'Reception',
                            'date'             => $d->reception_event_date?->toDateString() ?? '',
                            'venue'            => $d->reception_venue ?? '',
                            'start_time'       => $d->reception_start_time ?? '',
                            'end_time'         => '',
                            'google_maps_link' => $d->reception_event_google_maps_link ?? '',
                        ];
                    }
                }
                break;

            case 4: // Muslim
                $d = $wedding->muslimDetails;
                if ($d) {
                    if ($d->is_nikkah) {
                        $events[] = [
                            'label'            => 'Nikkah Ceremony',
                            'date'             => $d->nikkah_event_date?->toDateString() ?? '',
                            'venue'            => $d->nikkah_event_venue ?? '',
                            'start_time'       => $d->nikkah_start_time ?? '',
                            'end_time'         => '',
                            'google_maps_link' => $d->nikkah_event_google_maps_link ?? '',
                        ];
                    }
                    if ($d->is_reception) {
                        $events[] = [
                            'label'            => 'Reception',
                            'date'             => $d->reception_event_date?->toDateString() ?? '',
                            'venue'            => $d->reception_venue ?? '',
                            'start_time'       => $d->reception_start_time ?? '',
                            'end_time'         => '',
                            'google_maps_link' => $d->reception_event_google_maps_link ?? '',
                        ];
                    }
                }
                break;
        }

        return $events;
    }
}
