<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user    = Auth::user();
        $wedding = $user->wedding;

        if (! $wedding) {
            return Inertia::render('user/Dashboard', [
                'wedding'        => null,
                'stats'          => null,
                'pendingGuests'  => [],
                'recentActivity' => [],
                'latestMemories' => [],
            ]);
        }

        $guests = $wedding->guests()->get();

        $stats = [
            'totalGuests'    => $guests->count(),
            'rsvpClicks'     => $guests->whereNotNull('rsvp_clicked_at')->count(),
            'confirmed'      => $guests->where('rsvp_status', 'attending')->count(),
            'pending'        => $guests->where('rsvp_status', 'pending')->count(),
            'declined'       => $guests->where('rsvp_status', 'declined')->count(),
            'headCount'      => $guests->sum('attending_count'),
            'totalSeats'     => $wedding->tables()->sum('seat_count'),
            'assignedSeats'  => $wedding->tables()->join('table_assignments', 'tables.id', '=', 'table_assignments.table_id')->sum('table_assignments.assigned_count'),
        ];

        $pendingGuests = $guests->where('rsvp_status', 'pending')->values()->map(fn ($g) => [
            'id'         => $g->id,
            'guest_name' => $g->guest_name,
            'phone'      => $g->phone,
            'rsvp_status'=> $g->rsvp_status,
        ]);

        $recentActivity = $wedding->guests()
            ->whereNotNull('responded_at')
            ->orderByDesc('responded_at')
            ->limit(10)
            ->get()
            ->map(fn ($g) => [
                'id'   => $g->id,
                'text' => match ($g->rsvp_status) {
                    'attending' => "{$g->guest_name} confirmed attendance",
                    'declined'  => "{$g->guest_name} declined invitation",
                    default     => "{$g->guest_name} responded",
                },
                'time' => $g->responded_at->diffForHumans(),
                'type' => $g->rsvp_status,
            ]);

        $latestMemories = $wedding->memories()
            ->where('status', 'approved')
            ->orderByDesc('uploaded_at')
            ->limit(4)
            ->get()
            ->map(fn ($m) => [
                'id'         => $m->id,
                'image_path' => asset('storage/' . $m->image_path),
                'file_name'  => $m->file_name,
            ]);

        return Inertia::render('user/Dashboard', [
            'wedding' => [
                'bride_name'  => $wedding->bride_name,
                'groom_name'  => $wedding->groom_name,
                'venue_name'  => $wedding->venue_name,
                'event_date'  => $wedding->event_date?->toDateString(),
                'event_token' => $wedding->event_token,
            ],
            'stats'          => $stats,
            'pendingGuests'  => $pendingGuests,
            'recentActivity' => $recentActivity,
            'latestMemories' => $latestMemories,
        ]);
    }
}
