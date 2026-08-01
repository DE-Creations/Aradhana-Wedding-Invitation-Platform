<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Wedding;
use App\Models\WeddingGalleryImage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DesignController extends Controller
{
    public function preview(): Response
    {
        $user = Auth::user();

        /** @var Wedding|null $wedding */
        $wedding = $user?->wedding()->with(['weddingType', 'sinhalaDetails', 'christianDetails', 'tamilDetails', 'muslimDetails'])->first();

        if (! $wedding) {
            return redirect()->route('settings.index')
                ->with('error', 'Please complete your wedding setup before previewing the invitation.');
        }

        $mainImageUrl = $wedding->main_image
            ? asset('storage/' . $wedding->main_image)
            : null;

        $galleryImages = $wedding->galleryImages()
            ->orderBy('sort_order')
            ->get()
            ->map(fn (WeddingGalleryImage $img) => asset('storage/' . $img->image_path))
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
                'template_key'             => $wedding->template_key ?? 'noir-aurelle',
                'typography_key'           => $wedding->typography_key ?? 'gilded-garamond',
                'background_music_url'     => $wedding->background_music_path
                    ? asset('storage/' . $wedding->background_music_path)
                    : null,
                'background_music_label'   => $wedding->background_music_label,
                'background_music_enabled' => (bool) $wedding->background_music_enabled,
            ],
            'ceremonyEvents'      => $this->buildCeremonyEvents($wedding),
            'googleMapsLink'      => null,
            'guest'               => null,
            'coupleMainImage'     => $mainImageUrl,
            'coupleGalleryImages' => $galleryImages,
            'eventToken'          => $wedding->event_token,
        ]);
    }

    public function index(): Response
    {
        $user    = Auth::user();
        $wedding = $user?->wedding;

        $mainImageUrl  = null;
        $galleryImages = [];
        $ceremonyEvents = [];

        if ($wedding) {
            $wedding->load(['sinhalaDetails', 'christianDetails', 'tamilDetails', 'muslimDetails']);

            $mainImageUrl = $wedding->main_image
                ? asset('storage/' . $wedding->main_image)
                : null;

            $galleryImages = $wedding->galleryImages()
                ->orderBy('sort_order')
                ->get()
                ->map(fn (WeddingGalleryImage $img) => asset('storage/' . $img->image_path))
                ->values()
                ->toArray();

            $ceremonyEvents = $this->buildCeremonyEvents($wedding);
        }

        return Inertia::render('user/Design', [
            'coupleMainImage'          => $mainImageUrl,
            'coupleGalleryImages'      => $galleryImages,
            'ceremonyEvents'           => $ceremonyEvents,
            'backgroundMusicUrl'       => $wedding?->background_music_path
                ? asset('storage/' . $wedding->background_music_path)
                : null,
            'backgroundMusicLabel'     => $wedding?->background_music_label,
            'backgroundMusicEnabled'   => (bool) ($wedding?->background_music_enabled ?? true),
        ]);
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
