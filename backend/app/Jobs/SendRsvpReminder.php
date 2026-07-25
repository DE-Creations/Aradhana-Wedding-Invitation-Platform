<?php

namespace App\Jobs;

use App\Mail\RsvpReminderEmail;
use App\Models\Guest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendRsvpReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(public Guest $guest) {}

    public function handle(): void
    {
        $this->guest->loadMissing('invitation', 'rsvp');

        // Skip if the guest has since responded or has no email.
        if (blank($this->guest->email) || $this->guest->rsvp !== null) {
            return;
        }

        Mail::to($this->guest->email, $this->guest->name)
            ->send(new RsvpReminderEmail($this->guest));

        $this->guest->forceFill(['reminder_sent_at' => now()])->save();
    }
}
