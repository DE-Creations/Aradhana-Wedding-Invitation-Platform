<?php

namespace App\Jobs;

use App\Mail\InvitationEmail;
use App\Models\Guest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendInvitationEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(public Guest $guest) {}

    public function handle(): void
    {
        $this->guest->loadMissing('invitation');

        if (blank($this->guest->email)) {
            return;
        }

        Mail::to($this->guest->email, $this->guest->name)
            ->send(new InvitationEmail($this->guest));

        $this->guest->forceFill([
            'invitation_sent' => true,
            'invitation_sent_at' => now(),
        ])->save();
    }
}
