<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvitationRequest;
use App\Http\Requests\UpdateInvitationRequest;
use App\Http\Resources\InvitationResource;
use App\Models\Invitation;
use App\Services\InvitationMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserInvitationController extends Controller
{
    public function __construct(private readonly InvitationMediaService $media) {}

    /**
     * GET /api/user/invitations
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $invitations = $request->user()
            ->invitations()
            ->withCount(['guests', 'rsvps'])
            ->with('galleryPhotos')
            ->latest()
            ->paginate(15);

        return InvitationResource::collection($invitations);
    }

    /**
     * POST /api/user/invitations
     */
    public function store(StoreInvitationRequest $request): JsonResponse
    {
        $this->authorize('create', Invitation::class);

        $invitation = new Invitation($request->safe()->except([
            'couple_photo', 'groom_photo', 'bride_photo', 'music', 'gallery',
        ]));
        $invitation->user_id = $request->user()->id;
        $invitation->save();

        $this->persistMedia($invitation, $request);

        $invitation->load('galleryPhotos');

        return (new InvitationResource($invitation))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * PUT /api/user/invitations/{id}
     */
    public function update(UpdateInvitationRequest $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('update', $invitation);

        $invitation->fill($request->safe()->except([
            'couple_photo', 'groom_photo', 'bride_photo', 'music', 'gallery',
        ]));
        $invitation->save();

        $this->persistMedia($invitation, $request);

        $invitation->load('galleryPhotos');

        return (new InvitationResource($invitation))->response();
    }

    /**
     * DELETE /api/user/invitations/{id}
     */
    public function destroy(Invitation $invitation): JsonResponse
    {
        $this->authorize('delete', $invitation);

        $invitation->delete();

        return response()->json(['message' => 'Invitation deleted.']);
    }

    private function persistMedia(Invitation $invitation, Request $request): void
    {
        $singles = $this->media->storeSingles($invitation, [
            'couple_photo' => $request->file('couple_photo'),
            'groom_photo' => $request->file('groom_photo'),
            'bride_photo' => $request->file('bride_photo'),
            'music' => $request->file('music'),
        ]);

        if (! empty($singles)) {
            $invitation->forceFill($singles)->save();
        }

        if ($request->hasFile('gallery')) {
            $this->media->storeGallery($invitation, $request->file('gallery'));
        }
    }
}
