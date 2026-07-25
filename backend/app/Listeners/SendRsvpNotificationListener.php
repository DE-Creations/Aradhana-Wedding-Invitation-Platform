<?php

namespace App\Listeners;

use App\Events\RsvpSubmitted;
use App\Jobs\SendRsvpNotification;

class SendRsvpNotificationListener
{
    public function handle(RsvpSubmitted $event): void
    {
        SendRsvpNotification::dispatch($event->rsvp);
    }
}
