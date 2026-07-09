<?php

namespace App\Console\Commands;

use App\Mail\BigDayWishesMail;
use App\Models\EmailLog;
use App\Models\Wedding;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendBigDayWishesCommand extends Command
{
    protected $signature = 'mail:big-day-wishes
                            {--dry-run : List weddings found without sending emails}';

    protected $description = 'Send Big Day Wishes emails to couples whose wedding is tomorrow.';

    public function handle(): int
    {
        $tomorrow = now()->addDay()->toDateString();

        // Load all weddings with type-specific details and user.
        // event_date lives across 4 different tables so we resolve in PHP.
        $weddings = Wedding::query()
            ->with([
                'user',
                'sinhalaDetails',
                'christianDetails',
                'tamilDetails',
                'muslimDetails',
            ])
            ->get();

        $count = 0;

        foreach ($weddings as $wedding) {
            $eventDate = $wedding->primaryEventDate();

            if (! $eventDate || $eventDate->toDateString() !== $tomorrow) {
                continue;
            }

            $user = $wedding->user;

            if (! $user || ! $user->email) {
                $this->warn("Wedding #{$wedding->id} has no linked user or email — skipping.");
                continue;
            }

            // Duplicate guard via email_logs table.
            if (EmailLog::alreadySent($user->id, EmailLog::TYPE_BIG_DAY_WISHES)) {
                $this->line("Already sent Big Day Wishes to User #{$user->id} — skipping.");
                continue;
            }

            if ($this->option('dry-run')) {
                $this->line("DRY-RUN  Wedding #{$wedding->id}: {$wedding->bride_name} & {$wedding->groom_name} → {$user->email} (event: {$eventDate->toDateString()})");
                $count++;
                continue;
            }

            Mail::to($user->email, $user->name)->send(new BigDayWishesMail($user, $wedding, $eventDate));
            EmailLog::record($user->id, EmailLog::TYPE_BIG_DAY_WISHES);

            $this->info("Sent Big Day Wishes to {$user->email} for wedding #{$wedding->id}.");
            $count++;
        }

        $label = $this->option('dry-run') ? 'Would send to' : 'Sent to';
        $this->info("{$label} {$count} couple(s).");

        return self::SUCCESS;
    }
}
