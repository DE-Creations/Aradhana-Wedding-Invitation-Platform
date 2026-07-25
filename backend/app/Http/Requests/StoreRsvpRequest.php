<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRsvpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'invitation_id' => ['required', 'integer', 'exists:invitations,id'],
            'guest_token' => ['nullable', 'string', 'exists:guests,token'],
            'guest_name' => ['required_without:guest_token', 'nullable', 'string', 'max:255'],
            'attendance' => ['required', 'in:accepted,declined'],
            'number_of_guests' => ['nullable', 'integer', 'min:1', 'max:20'],
            'dietary_requirements' => ['nullable', 'string', 'max:1000'],
            'message' => ['nullable', 'string', 'max:2000'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'guest_name' => is_string($this->guest_name) ? trim(strip_tags($this->guest_name)) : $this->guest_name,
            'number_of_guests' => $this->number_of_guests ?: 1,
        ]);
    }
}
