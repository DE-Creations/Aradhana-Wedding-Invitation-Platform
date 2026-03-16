<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Wedding;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuestSearchController extends Controller
{
    public function index(Request $request)
    {
        $token = $request->query('token');

        if (! $token) {
            return Inertia::render('public/GuestSearch', ['wedding' => null, 'guests' => []]);
        }

        $wedding = Wedding::where('event_token', $token)
            ->where('status', '!=', 'draft')
            ->with('user')
            ->first();

        if (! $wedding) {
            return Inertia::render('public/GuestSearch', ['wedding' => null, 'guests' => []]);
        }

        $user            = $wedding->user;
        $tableManagement = (bool) ($user?->table_management ?? true);
        $shareMemory     = (bool) ($user?->share_memory ?? true);
        $imageCount      = (int)  ($user?->image_count ?? 20);

        $guests = Guest::where('guests.wedding_id', $wedding->id)
            ->leftJoin('table_assignments', 'guests.id', '=', 'table_assignments.guest_id')
            ->leftJoin('tables', 'table_assignments.table_id', '=', 'tables.id')
            ->select('guests.id', 'guests.guest_name', 'tables.table_name')
            ->get()
            ->map(fn ($g) => [
                'id'         => (string) $g->id,
                'guest_name' => $g->guest_name,
                'table_name' => $g->table_name,
            ])
            ->values()
            ->toArray();

        return Inertia::render('public/GuestSearch', [
            'wedding' => [
                'bride_name' => $wedding->bride_name,
                'groom_name' => $wedding->groom_name,
            ],
            'guests'          => $guests,
            'token'           => $token,
            'tableManagement' => $tableManagement,
            'shareMemory'     => $shareMemory,
            'imageCount'      => $imageCount,
        ]);
    }

    public function search(Request $request)
    {
        $token = $request->query('token');
        $q     = trim($request->query('q', ''));

        if (! $token || mb_strlen($q) < 2) {
            return response()->json([]);
        }

        $wedding = Wedding::where('event_token', $token)
            ->where('status', '!=', 'draft')
            ->first();

        if (! $wedding) {
            return response()->json([]);
        }

        $query = Guest::where('guests.wedding_id', $wedding->id)
            ->leftJoin('table_assignments', 'guests.id', '=', 'table_assignments.guest_id')
            ->leftJoin('tables', 'table_assignments.table_id', '=', 'tables.id')
            ->select('guests.id', 'guests.guest_name', 'tables.table_name');

        foreach (preg_split('/\s+/', $q, -1, PREG_SPLIT_NO_EMPTY) as $word) {
            $query->where('guests.guest_name', 'LIKE', '%' . $word . '%');
        }

        return response()->json(
            $query->limit(20)->get()->map(fn ($g) => [
                'id'         => (string) $g->id,
                'guest_name' => $g->guest_name,
                'table_name' => $g->table_name,
            ])->values()
        );
    }
}
