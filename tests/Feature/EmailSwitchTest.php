<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

it('has outgoing email switched off by default', function () {
    expect(config('features.mail_enabled'))->toBeFalse();
});

it('routes any missed Mail call to the array mailer when email is off', function () {
    expect(config('mail.default'))->toBe('array');
});

it('refuses to run the mail commands while email is off', function (string $command, array $arguments) {
    Mail::fake();

    $this->artisan($command, $arguments)
        ->expectsOutputToContain('Email sending is disabled')
        ->assertSuccessful();

    Mail::assertNothingSent();
    Mail::assertNothingQueued();
})->with([
    'big day wishes' => ['mail:big-day-wishes', []],
    'expiry reminder' => ['mail:expiry-reminder', []],
    'test mail' => ['mail:test', ['type' => 'all']],
]);

it('schedules only the expiry cleanup, once a day at 2 AM', function () {
    Artisan::call('schedule:list');
    $output = preg_replace('/\e\[[0-9;]*m/', '', Artisan::output());

    expect($output)->toMatch('/0\s+2\s+\*\s+\*\s+\*\s+php artisan users:expire/')
        ->and($output)->not->toContain('mail:');
});
