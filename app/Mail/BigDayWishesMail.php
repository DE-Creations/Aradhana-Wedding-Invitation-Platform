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

class BigDayWishesMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly User $user,
        public readonly Wedding $wedding,
        public readonly Carbon $eventDate,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Wishing You a Beautiful Wedding Day Tomorrow — Aradhana',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.big-day-wishes',
        );
    }
}
