<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
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
            ]);
        }

        $wedding = $user->wedding;

        $weddingData = null;
        $galleryImages = [];

        if ($wedding) {
            $weddingData = [
                'id'                  => (string) $wedding->id,
                'bride_name'          => $wedding->bride_name ?? '',
                'groom_name'          => $wedding->groom_name ?? '',
                'bride_parents_names' => $wedding->bride_parents_names ?? '',
                'groom_parents_names' => $wedding->groom_parents_names ?? '',
                'event_date'          => $wedding->event_date?->toDateString() ?? '',
                'rsvp_deadline'       => $wedding->rsvp_deadline?->toDateString() ?? '',
                'start_time'          => $wedding->start_time ?? '09:00',
                'end_time'            => $wedding->end_time ?? '16:00',
                'poruwa_time'         => $wedding->poruwa_time ?? '10:30',
                'venue_name'          => $wedding->venue_name ?? '',
                'venue_address'       => $wedding->venue_address ?? '',
                'google_maps_link'    => $wedding->google_maps_link ?? '',
                'contact_number_1'    => $wedding->contact_number_1 ?? '',
                'contact_number_2'    => $wedding->contact_number_2 ?? '',
                'template_key'        => $wedding->template_key ?? '',
                'typography_key'      => $wedding->typography_key ?? '',
                'status'              => $wedding->status ?? 'draft',
                'main_image_url'      => $this->resolveImageUrl($wedding->main_image),
            ];

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
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bride_name'          => ['required', 'string', 'max:255'],
            'groom_name'          => ['required', 'string', 'max:255'],
            'bride_parents_names' => ['nullable', 'string', 'max:255'],
            'groom_parents_names' => ['nullable', 'string', 'max:255'],
            'event_date'          => ['required', 'date'],
            'rsvp_deadline'       => ['nullable', 'date'],
            'start_time'          => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'end_time'            => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'poruwa_time'         => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'venue_name'          => ['required', 'string', 'max:255'],
            'venue_address'       => ['nullable', 'string'],
            'google_maps_link'    => ['nullable', 'url', 'max:2048'],
            'contact_number_1'    => ['nullable', 'string', 'max:40'],
            'contact_number_2'    => ['nullable', 'string', 'max:40'],
            'template_key'        => ['nullable', 'string', 'max:120'],
            'typography_key'      => ['nullable', 'string', 'max:120'],
            'status'              => ['required', 'in:draft,active,completed'],
        ]);

        $user = Auth::user();

        if (! $user) {
            return back()->withErrors(['wedding' => 'Not authenticated.']);
        }

        $wedding = $user->wedding;

        if (! $wedding) {
            return back()->withErrors(['wedding' => 'No wedding found for your account.']);
        }

        $wedding->update($validated);

        return back()->with('success', 'Wedding settings saved successfully.');
    }

    public function uploadMainImage(Request $request): RedirectResponse
    {
        $request->validate([
            'main_image' => ['required', 'image', 'max:10240', 'mimes:jpg,jpeg,png,webp'],
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
            'image' => ['required', 'image', 'max:10240', 'mimes:jpg,jpeg,png,webp'],
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

    private function resolveImageUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        return asset('storage/' . ltrim($path, '/'));
    }
}
