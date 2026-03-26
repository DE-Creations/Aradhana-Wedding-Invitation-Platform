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
            return Inertia::render('public/GuestSearch', ['wedding' => null, 'token' => '', 'tableManagement' => false, 'shareMemory' => false]);
        }

        $wedding = Wedding::where('event_token', $token)
            ->where('status', '!=', 'draft')
            ->with('user')
            ->first();

        if (! $wedding) {
            return Inertia::render('public/GuestSearch', ['wedding' => null, 'token' => '', 'tableManagement' => false, 'shareMemory' => false]);
        }

        return Inertia::render('public/GuestSearch', [
            'wedding' => [
                'bride_name' => $wedding->bride_name,
                'groom_name' => $wedding->groom_name,
            ],
            'token'           => $token,
            'tableManagement' => (bool) ($wedding->user?->table_management ?? true),
            'shareMemory'     => (bool) ($wedding->user?->share_memory ?? true),
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
            ->select('guests.id', 'guests.guest_name', 'tables.table_name', 'guests.image_count');

        foreach (preg_split('/\s+/', $q, -1, PREG_SPLIT_NO_EMPTY) as $word) {
            $query->where('guests.guest_name', 'LIKE', '%' . $word . '%');
        }

        return response()->json(
            $query->limit(20)->get()->map(fn ($g) => [
                'id'          => (string) $g->id,
                'guest_name'  => $g->guest_name,
                'table_name'  => $g->table_name,
                'image_count' => (int) $g->image_count,
            ])->values()
        );
    }

    public function findTable(Request $request)
    {
        $token = $request->query('token');

        if (! $token) {
            return Inertia::render('public/FindTable', ['wedding' => null, 'token' => '', 'tableManagement' => false]);
        }

        $wedding = Wedding::where('event_token', $token)
            ->where('status', '!=', 'draft')
            ->with('user')
            ->first();

        if (! $wedding) {
            return Inertia::render('public/FindTable', ['wedding' => null, 'token' => '', 'tableManagement' => false]);
        }

        return Inertia::render('public/FindTable', [
            'wedding' => [
                'bride_name' => $wedding->bride_name,
                'groom_name' => $wedding->groom_name,
            ],
            'token'           => $token,
            'tableManagement' => (bool) ($wedding->user?->table_management ?? true),
        ]);
    }

    public function shareMemories(Request $request)
    {
        $token = $request->query('token');

        if (! $token) {
            return Inertia::render('public/ShareMemories', ['wedding' => null, 'token' => '', 'shareMemory' => false, 'imageCount' => 0]);
        }

        $wedding = Wedding::where('event_token', $token)
            ->where('status', '!=', 'draft')
            ->with('user')
            ->first();

        if (! $wedding) {
            return Inertia::render('public/ShareMemories', ['wedding' => null, 'token' => '', 'shareMemory' => false, 'imageCount' => 0]);
        }

        return Inertia::render('public/ShareMemories', [
            'wedding' => [
                'bride_name' => $wedding->bride_name,
                'groom_name' => $wedding->groom_name,
            ],
            'token'       => $token,
            'shareMemory' => (bool) ($wedding->user?->share_memory ?? true),
            'imageCount'  => (int)  ($wedding->user?->image_count ?? 20),
        ]);
    }
}
