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
            ->firstOrFail();

        $guestToken = $request->query('guest');
        $guest = null;
        if ($guestToken) {
            $guest = Guest::where('guest_token', $guestToken)
                ->where('wedding_id', $wedding->id)
                ->first();
        }

        // Track invitation opened
        if ($guest) {
            if (!$guest->invitation_opened_at) {
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
                'typography_key'      => $wedding->typography_key ?? 'classic',
            ],
            'guest' => $guest ? [
                'id'            => $guest->id,
                'guest_name'    => $guest->guest_name,
                'guest_token'   => $guest->guest_token,
                'max_attendees' => $guest->max_attendees,
                'rsvp_status'   => $guest->rsvp_status,
            ] : null,
            'eventToken'         => $wedding->event_token,
            'coupleMainImage'    => $wedding->main_image ? asset('storage/' . $wedding->main_image) : null,
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
}
