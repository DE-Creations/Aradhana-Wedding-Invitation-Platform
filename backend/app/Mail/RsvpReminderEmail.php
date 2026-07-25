<?php

namespace App\Mail;

use App\Models\Guest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RsvpReminderEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Guest $guest)
    {
        $this->guest->loadMissing('invitation');
    }

    public function envelope(): Envelope
    {
        $invitation = $this->guest->invitation;

        return new Envelope(
            subject: "A Gentle Reminder — {$invitation->groom_name} & {$invitation->bride_name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.rsvp-reminder',
            with: [
                'guest' => $this->guest,
                'invitation' => $this->guest->invitation,
                'url' => $this->guest->personalized_url,
            ],
        );
    }
}
