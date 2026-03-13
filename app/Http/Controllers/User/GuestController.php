<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\GuestRequest;
use App\Models\Guest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class GuestController extends Controller
{
    public function index(): Response
    {
        $wedding = Auth::user()->wedding;

        if (! $wedding) {
            return Inertia::render('user/Guests', [
                'guests' => [],
                'tables' => [],
            ]);
        }

        $guests = $wedding->guests()
            ->with('table:id,table_name')
            ->orderBy('guest_name')
            ->get()
            ->map(fn ($g) => [
                'id'                  => $g->id,
                'guest_name'          => $g->guest_name,
                'phone'               => $g->phone,
                'max_attendees'       => $g->max_attendees,
                'rsvp_status'         => $g->rsvp_status,
                'attending_count'     => $g->attending_count ?? 0,
                'invitation_opened_at'=> $g->invitation_opened_at?->toDateTimeString(),
                'rsvp_clicked_at'     => $g->rsvp_clicked_at?->toDateTimeString(),
                'responded_at'        => $g->responded_at?->toDateTimeString(),
                'table_id'            => $g->table_id,
                'table_name'          => $g->table?->table_name,
                'guest_token'         => $g->guest_token,
            ]);

        $tables = $wedding->tables()->select('id', 'table_name')->get();

        return Inertia::render('user/Guests', [
            'guests'       => $guests,
            'tables'       => $tables,
            'event_token'  => $wedding->event_token,
        ]);
    }

    public function store(GuestRequest $request): RedirectResponse
    {
        $wedding = Auth::user()->wedding;

        if (! $wedding) {
            return back()->withErrors(['wedding' => 'No wedding found.']);
        }

        $wedding->guests()->create($request->validated());

        return back()->with('success', 'Guest added successfully.');
    }

    public function update(GuestRequest $request, Guest $guest): RedirectResponse
    {
        $this->authorizeGuest($guest);

        $guest->update($request->validated());

        return back()->with('success', 'Guest updated successfully.');
    }

    public function destroy(Guest $guest): RedirectResponse
    {
        $this->authorizeGuest($guest);

        $guest->delete();

        return back()->with('success', 'Guest deleted.');
    }

    private function authorizeGuest(Guest $guest): void
    {
        $wedding = Auth::user()->wedding;

        abort_if(! $wedding || $guest->wedding_id !== $wedding->id, 403);
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $wedding = Auth::user()->wedding;
        abort_if(! $wedding, 403);

        $path   = $request->file('csv_file')->getRealPath();
        $handle = fopen($path, 'r');

        $header  = null;
        $imported = 0;
        $skipped  = 0;

        while (($row = fgetcsv($handle)) !== false) {
            // Skip the header row
            if ($header === null) {
                $header = $row;
                continue;
            }

            // Support both full-export format (10 cols) and simple format (3 cols: Name, Phone, Max)
            $guestName    = trim($row[0] ?? '');
            $phone        = trim($row[1] ?? '');
            $maxAttendees = (int) ($row[2] ?? 1);

            if ($guestName === '') {
                $skipped++;
                continue;
            }

            $maxAttendees = max(1, min(20, $maxAttendees ?: 1));

            // Skip if a guest with the same name already exists for this wedding
            $exists = $wedding->guests()->where('guest_name', $guestName)->exists();
            if ($exists) {
                $skipped++;
                continue;
            }

            $wedding->guests()->create([
                'guest_name'    => $guestName,
                'phone'         => $phone ?: null,
                'max_attendees' => $maxAttendees,
            ]);

            $imported++;
        }

        fclose($handle);

        $message = "{$imported} guest(s) imported successfully.";
        if ($skipped > 0) {
            $message .= " {$skipped} row(s) skipped (duplicate name or empty).";
        }

        return back()->with('success', $message);
    }

    public function export(): StreamedResponse
    {
        $wedding = Auth::user()->wedding;

        abort_if(! $wedding, 403);

        $guests = $wedding->guests()
            ->with('table:id,table_name')
            ->orderBy('guest_name')
            ->get();

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="guests_' . now()->format('Ymd_His') . '.csv"',
        ];

        $callback = function () use ($guests, $wedding) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM so Excel opens it correctly
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'Guest Name',
                'Phone',
                'Max Attendees',
                'RSVP Status',
                'Attending Count',
                'Invitation Opened At',
                'RSVP Clicked At',
                'Responded At',
                'Table',
                'Invitation Link',
            ]);

            foreach ($guests as $g) {
                fputcsv($handle, [
                    $g->guest_name,
                    $g->phone,
                    $g->max_attendees,
                    $g->rsvp_status,
                    $g->attending_count ?? 0,
                    $g->invitation_opened_at?->toDateTimeString() ?? '',
                    $g->rsvp_clicked_at?->toDateTimeString() ?? '',
                    $g->responded_at?->toDateTimeString() ?? '',
                    $g->table?->table_name ?? '',
                    url('/invitation/' . $wedding->event_token . '?guest=' . $g->guest_token),
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
