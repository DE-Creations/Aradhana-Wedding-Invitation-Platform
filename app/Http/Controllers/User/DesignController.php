<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\WeddingGalleryImage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DesignController extends Controller
{
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
