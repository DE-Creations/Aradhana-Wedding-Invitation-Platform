<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvitationRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ownership is enforced in the controller via the policy.
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'template' => ['sometimes', 'string', 'max:100'],
            'event_type' => ['sometimes', 'in:wedding,birthday,anniversary,grand_opening'],
            'status' => ['sometimes', 'in:draft,published,expired'],

            'groom_name' => ['sometimes', 'string', 'max:255'],
            'bride_name' => ['sometimes', 'string', 'max:255'],
            'groom_father' => ['nullable', 'string', 'max:255'],
            'groom_mother' => ['nullable', 'string', 'max:255'],
            'bride_father' => ['nullable', 'string', 'max:255'],
            'bride_mother' => ['nullable', 'string', 'max:255'],
            'groom_phone' => ['nullable', 'string', 'max:32'],
            'bride_phone' => ['nullable', 'string', 'max:32'],

            'ceremony_date' => ['sometimes', 'date'],
            'ceremony_venue' => ['sometimes', 'string', 'max:255'],
            'ceremony_address' => ['sometimes', 'string', 'max:500'],
            'ceremony_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'ceremony_lng' => ['nullable', 'numeric', 'between:-180,180'],
            'reception_venue' => ['nullable', 'string', 'max:255'],
            'reception_address' => ['nullable', 'string', 'max:500'],
            'reception_time' => ['nullable', 'date'],
            'reception_lat' => ['nullable', 'numeric', 'between:-90,90'],
            'reception_lng' => ['nullable', 'numeric', 'between:-180,180'],

            'message' => ['nullable', 'string', 'max:2000'],

            'particle_type' => ['sometimes', 'in:rose_petals,stars,snowflakes,confetti,none'],
            'color_primary' => ['sometimes', 'string', 'max:9'],
            'color_accent' => ['sometimes', 'string', 'max:9'],
            'color_rose' => ['sometimes', 'string', 'max:9'],

            'couple_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'groom_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'bride_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'music' => ['nullable', 'file', 'mimes:mp3,wav,ogg', 'max:10240'],
            'gallery' => ['nullable', 'array', 'max:20'],
            'gallery.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
