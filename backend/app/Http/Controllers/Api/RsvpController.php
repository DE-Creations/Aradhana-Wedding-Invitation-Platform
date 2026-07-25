<?php

namespace App\Http\Controllers\Api;

use App\Events\RsvpSubmitted;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRsvpRequest;
use App\Http\Resources\RsvpResource;
use App\Models\Guest;
use App\Models\Rsvp;
use Illuminate\Http\JsonResponse;

class RsvpController extends Controller
{
    /**
     * POST /api/rsvp
     */
    public function store(StoreRsvpRequest $request): JsonResponse
    {
        $data = $request->validated();

        $guest = null;
        if (! empty($data['guest_token'])) {
            $guest = Guest::where('token', $data['guest_token'])
                ->where('invitation_id', $data['invitation_id'])
                ->first();

            if (! $guest) {
                return response()->json([
                    'message' => 'The guest token does not match this invitation.',
                ], 422);
            }
        }

        // Note: `responded_at` is intentionally omitted here. The Rsvp model
        // sets it automatically on creation (see Rsvp::booted), so including it
        // in updateOrCreate would overwrite the original submission time when a
        // guest edits an existing RSVP.
        $attributes = [
            'invitation_id' => $data['invitation_id'],
            'guest_id' => $guest?->id,
            'guest_name' => $guest?->name ?? $data['guest_name'],
            'attendance' => $data['attendance'],
            'number_of_guests' => $data['number_of_guests'] ?? 1,
            'dietary_requirements' => $data['dietary_requirements'] ?? null,
            'message' => $data['message'] ?? null,
        ];

        // A known guest updates their existing RSVP instead of duplicating it.
        if ($guest) {
            $rsvp = Rsvp::updateOrCreate(
                ['guest_id' => $guest->id],
                $attributes
            );
        } else {
            $rsvp = Rsvp::create($attributes);
        }

        // Notify the invitation owner via a queued job (Event -> Listener -> Job).
        RsvpSubmitted::dispatch($rsvp);

        return (new RsvpResource($rsvp))
            ->additional(['message' => 'Thank you! Your RSVP has been recorded.'])
            ->response()
            ->setStatusCode($rsvp->wasRecentlyCreated ? 201 : 200);
    }
}
