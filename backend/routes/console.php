<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Auto-expire invitations past their event date + 1 day.
Schedule::command('invitations:expire')->dailyAt('02:00');

// Send RSVP reminders 14 days and 3 days before the event.
Schedule::command('invitations:send-reminders')->dailyAt('10:00');
