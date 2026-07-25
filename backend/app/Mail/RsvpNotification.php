<?php

namespace App\Mail;

use App\Models\Rsvp;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RsvpNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Rsvp $rsvp)
    {
        $this->rsvp->loadMissing('invitation');
    }

    public function envelope(): Envelope
    {
        $verb = $this->rsvp->attendance === 'accepted' ? 'accepted' : 'declined';

        return new Envelope(
            subject: "New RSVP: {$this->rsvp->guest_name} {$verb}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.rsvp-notification',
            with: [
                'rsvp' => $this->rsvp,
                'invitation' => $this->rsvp->invitation,
            ],
        );
    }
}
