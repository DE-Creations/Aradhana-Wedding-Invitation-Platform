<?php

namespace App\Console\Commands;

use App\Mail\AccountExpiryReminderMail;
use App\Models\EmailLog;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendExpiryReminderCommand extends Command
{
    protected $signature = 'mail:expiry-reminder
                            {--dry-run : List users found without sending emails}';

    protected $description = 'Send Account Expiry Reminder emails to users whose account expires in 3 days.';

    public function handle(): int
    {
        $targetDate = now()->addDays(3)->toDateString();

        // Users expiring in exactly 3 days who are not already expired.
        $users = User::query()
            ->whereNotNull('expire_date')
            ->whereDate('expire_date', $targetDate)
            ->where('status', '!=', 'expired')
            ->get();

        $count = 0;

        foreach ($users as $user) {
            if (! $user->email) {
                $this->warn("User #{$user->id} has no email — skipping.");
                continue;
            }

            // Duplicate guard via email_logs table.
            if (EmailLog::alreadySent($user->id, EmailLog::TYPE_EXPIRY_REMINDER)) {
                $this->line("Already sent Expiry Reminder to User #{$user->id} — skipping.");
                continue;
            }

            if ($this->option('dry-run')) {
                $this->line("DRY-RUN  User #{$user->id}: {$user->name} → {$user->email} (expires: {$user->expire_date->toDateString()})");
                $count++;
                continue;
            }

            Mail::to($user->email)->send(new AccountExpiryReminderMail($user, $user->expire_date));
            EmailLog::record($user->id, EmailLog::TYPE_EXPIRY_REMINDER);

            $this->info("Sent Expiry Reminder to {$user->email} (User #{$user->id}).");
            $count++;
        }

        $label = $this->option('dry-run') ? 'Would send to' : 'Sent to';
        $this->info("{$label} {$count} user(s).");

        return self::SUCCESS;
    }
}
