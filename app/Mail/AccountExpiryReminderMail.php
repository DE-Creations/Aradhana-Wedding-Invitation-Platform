<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Wedding;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccountExpiryReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public readonly ?Wedding $wedding;

    public function __construct(
        public readonly User $user,
        public readonly Carbon $expiryDate,
    ) {
        $this->wedding = $user->relationLoaded('wedding')
            ? $user->wedding
            : $user->wedding()->first();
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Aradhana Account Expires in 3 Days',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.expiry-reminder',
        );
    }
}
