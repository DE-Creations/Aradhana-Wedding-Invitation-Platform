<?php

namespace App\Console\Commands;

use App\Jobs\SendRsvpReminder;
use App\Models\Invitation;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SendRsvpReminders extends Command
{
    protected $signature = 'invitations:send-reminders';

    protected $description = 'Send RSVP reminders to guests of invitations whose ceremony is 14 or 3 days away';

    public function handle(): int
    {
        // Match ceremonies falling on the target days (14 and 3 days out).
        $targetDates = [
            now()->addDays(14)->toDateString(),
            now()->addDays(3)->toDateString(),
        ];

        $invitations = Invitation::query()
            ->where('status', 'published')
            ->whereIn(DB::raw('DATE(ceremony_date)'), $targetDates)
            ->get();

        $dispatched = 0;

        foreach ($invitations as $invitation) {
            $guests = $invitation->guests()
                ->whereNotNull('email')
                ->whereDoesntHave('rsvp')
                ->where(function ($q) {
                    // Avoid spamming: only remind if not reminded in the last 7 days.
                    $q->whereNull('reminder_sent_at')
                        ->orWhere('reminder_sent_at', '<', now()->subDays(7));
                })
                ->get();

            foreach ($guests as $guest) {
                SendRsvpReminder::dispatch($guest);
                $dispatched++;
            }
        }

        $this->info("Dispatched {$dispatched} reminder(s).");

        return self::SUCCESS;
    }
}
