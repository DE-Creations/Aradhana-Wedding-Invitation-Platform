<?php

namespace App\Events;

use App\Models\Rsvp;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RsvpSubmitted
{
    use Dispatchable, SerializesModels;

    public function __construct(public Rsvp $rsvp) {}
}
