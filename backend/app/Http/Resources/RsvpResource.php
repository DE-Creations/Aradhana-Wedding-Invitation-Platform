<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\Rsvp
 */
class RsvpResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invitation_id' => $this->invitation_id,
            'guest_id' => $this->guest_id,
            'guest_name' => $this->guest_name,
            'attendance' => $this->attendance,
            'number_of_guests' => $this->number_of_guests,
            'dietary_requirements' => $this->dietary_requirements,
            'message' => $this->message,
            'responded_at' => optional($this->responded_at)->toIso8601String(),
        ];
    }
}
