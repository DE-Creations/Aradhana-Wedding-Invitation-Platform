<?php

namespace App\Console\Commands;

use App\Mail\AccountExpiryReminderMail;
use App\Mail\BigDayWishesMail;
use App\Mail\WelcomeClientMail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

/**
 * Developer utility to test Aradhana system emails on localhost.
 *
 * Usage:
 *   php artisan mail:test welcome    --user=1
 *   php artisan mail:test bigday     --user=1
 *   php artisan mail:test expiry     --user=1
 *   php artisan mail:test all        --user=1
 */
class SendTestMailCommand extends Command
{
    protected $signature = 'mail:test
                            {type : welcome | bigday | expiry | all}
                            {--user= : User ID to send test email to (defaults to first user)}
                            {--to= : Override recipient email address}';

    protected $description = 'Send a test Aradhana system email to a user (dev/localhost use only).';

    public function handle(): int
    {
        $type = $this->argument('type');
        $userId = $this->option('user');
        $toOverride = $this->option('to');

        $user = $userId
            ? User::with('wedding')->find($userId)
            : User::with('wedding')->first();

        if (! $user) {
            $this->error('No user found. Pass --user=ID or ensure the users table has at least one record.');
            return self::FAILURE;
        }

        $recipient = $toOverride ?: $user->email;

        $this->info("Sending test email(s) for type [{$type}] to [{$recipient}] (User: {$user->name})");

        match ($type) {
            'welcome' => $this->sendWelcome($user, $recipient),
            'bigday'  => $this->sendBigDay($user, $recipient),
            'expiry'  => $this->sendExpiry($user, $recipient),
            'all'     => $this->sendAll($user, $recipient),
            default   => $this->error("Unknown type [{$type}]. Use: welcome | bigday | expiry | all"),
        };

        return self::SUCCESS;
    }

    private function sendWelcome(User $user, string $recipient): void
    {
        Mail::to($recipient)->send(new WelcomeClientMail($user, $user->wedding));
        $this->info('  ✓ Welcome email sent.');
    }

    private function sendBigDay(User $user, string $recipient): void
    {
        $wedding = $user->wedding;

        if (! $wedding) {
            $this->warn('  ⚠  No wedding found for this user. Creating a dummy wedding object for preview.');
            // Use a stub wedding for preview purposes only
            $wedding = new \App\Models\Wedding([
                'bride_name' => 'Sithuli',
                'groom_name' => 'Ashen',
            ]);
            $wedding->id = 0;
        }

        $eventDate = Carbon::tomorrow();
        Mail::to($recipient)->send(new BigDayWishesMail($user, $wedding, $eventDate));
        $this->info('  ✓ Big Day Wishes email sent (event date set to tomorrow for preview).');
    }

    private function sendExpiry(User $user, string $recipient): void
    {
        $expiryDate = $user->expire_date ?? Carbon::now()->addDays(3);
        Mail::to($recipient)->send(new AccountExpiryReminderMail($user, $expiryDate));
        $this->info('  ✓ Account Expiry Reminder email sent.');
    }

    private function sendAll(User $user, string $recipient): void
    {
        $this->sendWelcome($user, $recipient);
        $this->sendBigDay($user, $recipient);
        $this->sendExpiry($user, $recipient);
    }
}
