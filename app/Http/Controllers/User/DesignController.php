<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\WeddingGalleryImage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DesignController extends Controller
{
    public function preview(): Response
    {
        $user    = Auth::user();
        $wedding = $user?->wedding;

        if (! $wedding) {
            abort(404);
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
                'bride_name'          => $wedding->bride_name,
                'groom_name'          => $wedding->groom_name,
                'bride_parents_names' => $wedding->bride_parents_names,
                'groom_parents_names' => $wedding->groom_parents_names,
                'event_date'          => $wedding->event_date?->toDateString(),
                'start_time'          => $wedding->start_time,
                'end_time'            => $wedding->end_time,
                'poruwa_time'         => $wedding->poruwa_time,
                'venue_name'          => $wedding->venue_name,
                'venue_address'       => $wedding->venue_address,
                'google_maps_link'    => $wedding->google_maps_link,
                'contact_number_1'    => $wedding->contact_number_1,
                'contact_number_2'    => $wedding->contact_number_2,
                'template_key'        => $wedding->template_key ?? 'faded-picture-overlay',
                'typography_key'      => $wedding->typography_key ?? 'classic-grace',
            ],
            'guest'              => null,
            'coupleMainImage'    => $mainImageUrl,
            'coupleGalleryImages' => $galleryImages,
            'eventToken'         => $wedding->event_token,
        ]);
    }

    public function index(): Response
    {
        $user = Auth::user();
        $wedding = $user?->wedding;

        $mainImageUrl = null;
        $galleryImages = [];

        if ($wedding) {
            $mainImageUrl = $wedding->main_image
                ? asset('storage/' . $wedding->main_image)
                : null;

            $galleryImages = $wedding->galleryImages()
                ->orderBy('sort_order')
                ->get()
                ->map(fn (WeddingGalleryImage $img) => asset('storage/' . $img->image_path))
                ->values()
                ->toArray();
        }

        return Inertia::render('user/Design', [
            'coupleMainImage'    => $mainImageUrl,
            'coupleGalleryImages' => $galleryImages,
        ]);
    }
}
