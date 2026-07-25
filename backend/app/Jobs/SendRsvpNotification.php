<?php

namespace App\Jobs;

use App\Mail\RsvpNotification;
use App\Models\Rsvp;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendRsvpNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(public Rsvp $rsvp) {}

    public function handle(): void
    {
        $this->rsvp->loadMissing('invitation.user');

        $owner = $this->rsvp->invitation?->user;

        if (! $owner || blank($owner->email)) {
            return;
        }

        Mail::to($owner->email, $owner->name)
            ->send(new RsvpNotification($this->rsvp));
    }
}
