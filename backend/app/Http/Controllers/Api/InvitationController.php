<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvitationResource;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Http\JsonResponse;

class InvitationController extends Controller
{
    /**
     * GET /api/invitations/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $invitation = Invitation::query()
            ->published()
            ->with(['galleryPhotos'])
            ->where('slug', $slug)
            ->first();

        if (! $invitation) {
            return response()->json(['message' => 'Invitation not found.'], 404);
        }

        // Increment views without touching updated_at.
        $invitation->incrementQuietly('views_count');

        return (new InvitationResource($invitation))->response();
    }

    /**
     * GET /api/invitations/{slug}/guest/{token}
     */
    public function showForGuest(string $slug, string $token): JsonResponse
    {
        $invitation = Invitation::query()
            ->published()
            ->with(['galleryPhotos'])
            ->where('slug', $slug)
            ->first();

        if (! $invitation) {
            return response()->json(['message' => 'Invitation not found.'], 404);
        }

        $guest = Guest::query()
            ->with('rsvp')
            ->where('invitation_id', $invitation->id)
            ->where('token', $token)
            ->first();

        if (! $guest) {
            return response()->json(['message' => 'Guest not found.'], 404);
        }

        $invitation->incrementQuietly('views_count');

        return (new InvitationResource($invitation))
            ->withGuest($guest)
            ->response();
    }
}
