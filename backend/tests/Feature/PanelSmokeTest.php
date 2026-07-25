<?php

namespace Tests\Feature;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PanelSmokeTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_renders_for_admin(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->get('/admin')->assertOk();
        $this->actingAs($admin)->get('/admin/users')->assertOk();
        $this->actingAs($admin)->get('/admin/invitations')->assertOk();
        $this->actingAs($admin)->get('/admin/rsvps')->assertOk();
        $this->actingAs($admin)->get('/admin/contact-messages')->assertOk();
    }

    public function test_regular_user_cannot_access_admin_panel(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)->get('/admin')->assertForbidden();
    }

    public function test_user_dashboard_renders_and_scopes_invitations(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $other = User::factory()->create(['role' => 'user']);

        $mine = Invitation::factory()->create(['user_id' => $user->id]);
        $theirs = Invitation::factory()->create(['user_id' => $other->id]);

        $this->actingAs($user)->get('/dashboard')->assertOk();
        $this->actingAs($user)->get('/dashboard/invitations')->assertOk();
        $this->actingAs($user)
            ->get("/dashboard/invitations/{$mine->id}/edit")
            ->assertOk();

        // A user must not be able to edit someone else's invitation.
        $this->actingAs($user)
            ->get("/dashboard/invitations/{$theirs->id}/edit")
            ->assertNotFound();
    }
}
