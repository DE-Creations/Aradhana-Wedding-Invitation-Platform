<?php

namespace Tests\Feature;

use App\Mail\InvitationEmail;
use App\Mail\RsvpNotification;
use App\Mail\RsvpReminderEmail;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Rsvp;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MailRenderTest extends TestCase
{
    use RefreshDatabase;

    public function test_all_mailables_render(): void
    {
        $user = User::factory()->create();
        $invitation = Invitation::factory()->create(['user_id' => $user->id]);
        $guest = Guest::factory()->create([
            'invitation_id' => $invitation->id,
            'email' => 'guest@example.com',
        ]);
        $rsvp = Rsvp::factory()->create([
            'invitation_id' => $invitation->id,
            'guest_id' => $guest->id,
        ]);

        // Rendering exercises the Blade markdown templates.
        $this->assertNotEmpty((new InvitationEmail($guest))->render());
        $this->assertNotEmpty((new RsvpReminderEmail($guest))->render());
        $this->assertNotEmpty((new RsvpNotification($rsvp))->render());
    }
}
