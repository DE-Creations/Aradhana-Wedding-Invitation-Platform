<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\TableRequest;
use App\Models\Guest;
use App\Models\TableAssignment;
use App\Models\WeddingTable;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class TableController extends Controller
{
    public function index(): Response
    {
        $wedding = Auth::user()->wedding;

        if (! $wedding) {
            return Inertia::render('user/Tables', [
                'tables'    => [],
                'guests'    => [],
            ]);
        }

        $tables = $wedding->tables()
            ->with(['assignments.guest:id,guest_name,attending_count,rsvp_status'])
            ->get()
            ->map(fn ($t) => [
                'id'         => $t->id,
                'table_name' => $t->table_name,
                'seat_count' => $t->seat_count,
                'created_at' => $t->created_at?->toDateString(),
                'guests'     => $t->assignments->map(fn ($a) => [
                    'id'              => $a->guest->id,
                    'guest_name'      => $a->guest->guest_name,
                    'attending_count' => $a->guest->attending_count ?? 0,
                    'rsvp_status'     => $a->guest->rsvp_status,
                    'assigned_count'  => $a->assigned_count,
                    'assignment_id'   => $a->id,
                ]),
                'assigned_count' => $t->assignments->sum('assigned_count'),
            ]);

        $guests = $wedding->guests()
            ->select('id', 'guest_name', 'max_attendees', 'rsvp_status', 'table_id', 'attending_count')
            ->get()
            ->map(fn ($g) => [
                'id'              => $g->id,
                'guest_name'      => $g->guest_name,
                'max_attendees'   => $g->max_attendees,
                'rsvp_status'     => $g->rsvp_status,
                'table_id'        => $g->table_id,
                'attending_count' => $g->attending_count ?? 0,
            ]);

        return Inertia::render('user/Tables', [
            'tables' => $tables,
            'guests' => $guests,
        ]);
    }

    public function store(TableRequest $request): RedirectResponse
    {
        $wedding = Auth::user()->wedding;

        if (! $wedding) {
            return back()->withErrors(['wedding' => 'No wedding found.']);
        }

        $wedding->tables()->create(array_merge($request->validated(), [
            'created_at' => now(),
        ]));

        return back()->with('success', 'Table added successfully.');
    }

    public function update(TableRequest $request, WeddingTable $table): RedirectResponse
    {
        $this->authorizeTable($table);

        $table->update($request->validated());

        return back()->with('success', 'Table updated.');
    }

    public function destroy(WeddingTable $table): RedirectResponse
    {
        $this->authorizeTable($table);

        TableAssignment::where('table_id', $table->id)->delete();
        Guest::where('table_id', $table->id)->update(['table_id' => null]);
        $table->delete();

        return back()->with('success', 'Table deleted.');
    }

    public function assign(Request $request, WeddingTable $table): RedirectResponse
    {
        $this->authorizeTable($table);

        $request->validate([
            'guest_id' => ['required', 'integer', 'exists:guests,id'],
        ]);

        $wedding  = Auth::user()->wedding;
        $guest    = Guest::findOrFail($request->guest_id);

        abort_if($guest->wedding_id !== $wedding->id, 403);

        // Update or create assignment
        TableAssignment::updateOrCreate(
            ['guest_id' => $guest->id],
            [
                'wedding_id'     => $wedding->id,
                'table_id'       => $table->id,
                'assigned_count' => $guest->attending_count ?: $guest->max_attendees,
            ]
        );

        // Update guest's table_id
        $guest->update(['table_id' => $table->id]);

        return back()->with('success', 'Guest assigned to table.');
    }

    public function unassign(Request $request, WeddingTable $table): RedirectResponse
    {
        $this->authorizeTable($table);

        $request->validate([
            'guest_id' => ['required', 'integer', 'exists:guests,id'],
        ]);

        TableAssignment::where('table_id', $table->id)
            ->where('guest_id', $request->guest_id)
            ->delete();

        Guest::where('id', $request->guest_id)->update(['table_id' => null]);

        return back()->with('success', 'Guest unassigned.');
    }

    public function printPdf(): HttpResponse
    {
        $wedding = Auth::user()->wedding;

        abort_if(! $wedding, 404);

        $tables = $wedding->tables()
            ->with(['assignments.guest:id,guest_name,attending_count,rsvp_status'])
            ->orderBy('table_name')
            ->get()
            ->map(fn ($t) => [
                'table_name'     => $t->table_name,
                'seat_count'     => $t->seat_count,
                'assigned_count' => $t->assignments->sum('assigned_count'),
                'guests'         => $t->assignments->map(fn ($a) => [
                    'guest_name'      => $a->guest->guest_name,
                    'attending_count' => $a->guest->attending_count ?? 0,
                    'rsvp_status'     => $a->guest->rsvp_status,
                    'assigned_count'  => $a->assigned_count,
                ])->values(),
            ]);

        $pdf = Pdf::loadView('pdf.table-seating-chart', [
            'wedding' => $wedding,
            'tables'  => $tables,
        ])->setPaper('a4', 'portrait');

        $coupleNames = trim(($wedding->groom_name ?? '') . '-' . ($wedding->bride_name ?? ''));
        $filename = 'seating-chart-' . (str($coupleNames)->slug() ?: 'aradhana') . '.pdf';

        return $pdf->stream($filename);
    }

    private function authorizeTable(WeddingTable $table): void
    {
        $wedding = Auth::user()->wedding;
        abort_if(! $wedding || $table->wedding_id !== $wedding->id, 403);
    }
}
