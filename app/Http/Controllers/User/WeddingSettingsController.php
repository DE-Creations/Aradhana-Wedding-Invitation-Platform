<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\ChristianWedding;
use App\Models\MuslimWedding;
use App\Models\SinhalaWedding;
use App\Models\TamilWedding;
use App\Models\Wedding;
use App\Models\WeddingGalleryImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class WeddingSettingsController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        if (! $user) {
            return Inertia::render('user/Settings', [
                'wedding'       => null,
                'galleryImages' => [],
                'eventDetails'  => null,
            ]);
        }

        /** @var Wedding|null $wedding */
        $wedding = $user->wedding()->with('weddingType')->first();

        $weddingData   = null;
        $galleryImages = [];
        $eventDetails  = null;

        if ($wedding) {
            $weddingData = [
                'id'                  => (string) $wedding->id,
                'bride_name'          => $wedding->bride_name ?? '',
                'groom_name'          => $wedding->groom_name ?? '',
                'bride_parents_names' => $wedding->bride_parents_names ?? '',
                'groom_parents_names' => $wedding->groom_parents_names ?? '',
                'wedding_type_id'     => (string) ($wedding->wedding_type_id ?? ''),
                'wedding_type_name'   => $wedding->weddingType?->name ?? '',
                'rsvp_deadline'       => $wedding->rsvp_deadline?->toDateString() ?? '',
                'contact_number_1'    => $wedding->contact_number_1 ?? '',
                'contact_number_2'    => $wedding->contact_number_2 ?? '',
                'template_key'        => $wedding->template_key ?? '',
                'typography_key'      => $wedding->typography_key ?? '',
                'status'              => $wedding->status ?? 'draft',
                'main_image_url'      => $this->resolveImageUrl($wedding->main_image),
            ];

            $eventDetails = $this->loadEventDetails($wedding);

            $galleryImages = $wedding->galleryImages()
                ->orderBy('sort_order')
                ->get()
                ->map(fn (WeddingGalleryImage $img) => [
                    'id'         => (string) $img->id,
                    'image_url'  => $this->resolveImageUrl($img->image_path),
                    'sort_order' => $img->sort_order,
                ])
                ->values();
        }

        return Inertia::render('user/Settings', [
            'wedding'       => $weddingData,
            'galleryImages' => $galleryImages,
            'eventDetails'  => $eventDetails,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = Auth::user();

        if (! $user) {
            return back()->withErrors(['wedding' => 'Not authenticated.']);
        }

        $wedding = $user->wedding;

        if (! $wedding) {
            return back()->withErrors(['wedding' => 'No wedding found for your account.']);
        }

        $baseValidated = $request->validate([
            'bride_parents_names' => ['nullable', 'string', 'max:255'],
            'groom_parents_names' => ['nullable', 'string', 'max:255'],
            'rsvp_deadline'       => ['nullable', 'date'],
            'contact_number_1'    => ['nullable', 'string', 'max:40'],
            'contact_number_2'    => ['nullable', 'string', 'max:40'],
            'template_key'        => ['nullable', 'string', 'max:120'],
            'typography_key'      => ['nullable', 'string', 'max:120'],
            'status'              => ['required', 'in:draft,active,completed'],
        ]);

        $wedding->update($baseValidated);

        $this->saveEventDetails($request, $wedding);

        return back()->with('success', 'Wedding settings saved successfully.');
    }

    public function uploadMainImage(Request $request): RedirectResponse
    {
        $request->validate([
            'main_image' => ['required', 'image', 'max:15360', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $user = Auth::user();

        if (! $user) {
            return back()->withErrors(['wedding' => 'Not authenticated.']);
        }

        $wedding = $user->wedding;

        if (! $wedding) {
            return back()->withErrors(['wedding' => 'No wedding found.']);
        }

        if ($wedding->main_image) {
            Storage::disk('public')->delete($wedding->main_image);
        }

        $folderName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $user->name ?? 'user_' . $user->id);
        $path = $request->file('main_image')->store('weddings/' . $folderName . '/main-image', 'public');
        $wedding->update(['main_image' => $path]);

        return back()->with('success', 'Main image uploaded.');
    }

    public function deleteMainImage(): RedirectResponse
    {
        $user = Auth::user();

        if (! $user) {
            return back()->withErrors(['wedding' => 'Not authenticated.']);
        }

        $wedding = $user->wedding;

        if (! $wedding) {
            return back()->withErrors(['wedding' => 'No wedding found.']);
        }

        if ($wedding->main_image) {
            Storage::disk('public')->delete($wedding->main_image);
            $wedding->update(['main_image' => null]);
        }

        return back()->with('success', 'Main image removed.');
    }

    public function addGalleryImage(Request $request): RedirectResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'max:15360', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $user = Auth::user();

        if (! $user) {
            return back()->withErrors(['wedding' => 'Not authenticated.']);
        }

        $wedding = $user->wedding;

        if (! $wedding) {
            return back()->withErrors(['wedding' => 'No wedding found.']);
        }

        $folderName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $user->name ?? 'user_' . $user->id);
        $path = $request->file('image')->store('weddings/' . $folderName . '/gallery-images', 'public');
        $maxOrder = $wedding->galleryImages()->max('sort_order') ?? 0;

        WeddingGalleryImage::create([
            'wedding_id' => $wedding->id,
            'image_path' => $path,
            'sort_order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Photo added to gallery.');
    }

    public function removeGalleryImage(WeddingGalleryImage $image): RedirectResponse
    {
        $user = Auth::user();

        if (! $user) {
            abort(403);
        }

        $wedding = $user->wedding;

        if (! $wedding || $image->wedding_id !== $wedding->id) {
            abort(403);
        }

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Photo removed.');
    }

    private function loadEventDetails(Wedding $wedding): ?array
    {
        switch ((int) $wedding->wedding_type_id) {
            case 1: // Sinhala
                $d = $wedding->sinhalaDetails;
                return [
                    'type'             => 'sinhala',
                    'event_date'       => $d?->event_date?->toDateString() ?? '',
                    'venue'            => $d?->venue ?? '',
                    'start_time'       => $d?->start_time ?? '',
                    'poruwa_time'      => $d?->poruwa_time ?? '',
                    'end_time'         => $d?->end_time ?? '',
                    'google_maps_link' => $d?->google_maps_link ?? '',
                ];
            case 2: // Christian
                $d = $wedding->christianDetails;
                return [
                    'type'                             => 'christian',
                    'is_church_ceremony'               => (bool) ($d?->is_church_ceremony ?? false),
                    'church_event_date'                => $d?->church_event_date?->toDateString() ?? '',
                    'church_venue'                     => $d?->church_venue ?? '',
                    'ceremony_time'                    => $d?->ceremony_time ?? '',
                    'church_event_google_maps_link'    => $d?->church_event_google_maps_link ?? '',
                    'is_reception'                     => (bool) ($d?->is_reception ?? false),
                    'reception_event_date'             => $d?->reception_event_date?->toDateString() ?? '',
                    'reception_venue'                  => $d?->reception_venue ?? '',
                    'reception_start_time'             => $d?->reception_start_time ?? '',
                    'reception_end_time'               => $d?->reception_end_time ?? '',
                    'reception_event_google_maps_link' => $d?->reception_event_google_maps_link ?? '',
                ];
            case 3: // Tamil
                $d = $wedding->tamilDetails;
                return [
                    'type'                              => 'tamil',
                    'is_muhurtham'                      => (bool) ($d?->is_muhurtham ?? false),
                    'muhurtham_event_date'              => $d?->muhurtham_event_date?->toDateString() ?? '',
                    'muhurtham_event_venue'             => $d?->muhurtham_event_venue ?? '',
                    'muhurtham_start_time'              => $d?->muhurtham_start_time ?? '',
                    'muhurtham_end_time'                => $d?->muhurtham_end_time ?? '',
                    'muhurtham_event_google_maps_link'  => $d?->muhurtham_event_google_maps_link ?? '',
                    'is_reception'                      => (bool) ($d?->is_reception ?? false),
                    'reception_event_date'              => $d?->reception_event_date?->toDateString() ?? '',
                    'reception_venue'                   => $d?->reception_venue ?? '',
                    'reception_start_time'              => $d?->reception_start_time ?? '',
                    'reception_event_google_maps_link'  => $d?->reception_event_google_maps_link ?? '',
                ];
            case 4: // Muslim
                $d = $wedding->muslimDetails;
                return [
                    'type'                             => 'muslim',
                    'is_nikkah'                        => (bool) ($d?->is_nikkah ?? false),
                    'nikkah_event_date'                => $d?->nikkah_event_date?->toDateString() ?? '',
                    'nikkah_event_venue'               => $d?->nikkah_event_venue ?? '',
                    'nikkah_start_time'                => $d?->nikkah_start_time ?? '',
                    'nikkah_event_google_maps_link'    => $d?->nikkah_event_google_maps_link ?? '',
                    'is_reception'                     => (bool) ($d?->is_reception ?? false),
                    'reception_event_date'             => $d?->reception_event_date?->toDateString() ?? '',
                    'reception_venue'                  => $d?->reception_venue ?? '',
                    'reception_start_time'             => $d?->reception_start_time ?? '',
                    'reception_event_google_maps_link' => $d?->reception_event_google_maps_link ?? '',
                ];
            default:
                return null;
        }
    }

    private function saveEventDetails(Request $request, Wedding $wedding): void
    {
        switch ((int) $wedding->wedding_type_id) {
            case 1: // Sinhala
                $validated = $request->validate([
                    'event_date'       => ['nullable', 'date'],
                    'venue'            => ['nullable', 'string', 'max:255'],
                    'start_time'       => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'poruwa_time'      => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'end_time'         => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'google_maps_link' => ['nullable', 'url', 'max:2048'],
                ]);
                SinhalaWedding::updateOrCreate(['wedding_id' => $wedding->id], $validated);
                break;

            case 2: // Christian
                $validated = $request->validate([
                    'is_church_ceremony'               => ['boolean'],
                    'church_event_date'                => ['nullable', 'date'],
                    'church_venue'                     => ['nullable', 'string', 'max:255'],
                    'ceremony_time'                    => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'church_event_google_maps_link'    => ['nullable', 'url', 'max:2048'],
                    'is_reception'                     => ['boolean'],
                    'reception_event_date'             => ['nullable', 'date'],
                    'reception_venue'                  => ['nullable', 'string', 'max:255'],
                    'reception_start_time'             => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'reception_end_time'               => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'reception_event_google_maps_link' => ['nullable', 'url', 'max:2048'],
                ]);
                ChristianWedding::updateOrCreate(['wedding_id' => $wedding->id], $validated);
                break;

            case 3: // Tamil
                $validated = $request->validate([
                    'is_muhurtham'                     => ['boolean'],
                    'muhurtham_event_date'             => ['nullable', 'date'],
                    'muhurtham_event_venue'            => ['nullable', 'string', 'max:255'],
                    'muhurtham_start_time'             => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'muhurtham_end_time'               => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'muhurtham_event_google_maps_link' => ['nullable', 'url', 'max:2048'],
                    'is_reception'                     => ['boolean'],
                    'reception_event_date'             => ['nullable', 'date'],
                    'reception_venue'                  => ['nullable', 'string', 'max:255'],
                    'reception_start_time'             => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'reception_event_google_maps_link' => ['nullable', 'url', 'max:2048'],
                ]);
                TamilWedding::updateOrCreate(['wedding_id' => $wedding->id], $validated);
                break;

            case 4: // Muslim
                $validated = $request->validate([
                    'is_nikkah'                        => ['boolean'],
                    'nikkah_event_date'                => ['nullable', 'date'],
                    'nikkah_event_venue'               => ['nullable', 'string', 'max:255'],
                    'nikkah_start_time'                => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'nikkah_event_google_maps_link'    => ['nullable', 'url', 'max:2048'],
                    'is_reception'                     => ['boolean'],
                    'reception_event_date'             => ['nullable', 'date'],
                    'reception_venue'                  => ['nullable', 'string', 'max:255'],
                    'reception_start_time'             => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
                    'reception_event_google_maps_link' => ['nullable', 'url', 'max:2048'],
                ]);
                MuslimWedding::updateOrCreate(['wedding_id' => $wedding->id], $validated);
                break;
        }
    }

    private function resolveImageUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        return asset('storage/' . ltrim($path, '/'));
    }
}
