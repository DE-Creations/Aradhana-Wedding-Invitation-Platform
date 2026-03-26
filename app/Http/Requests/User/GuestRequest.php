<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class GuestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'guest_name'    => ['required', 'string', 'max:255'],
            'phone'         => ['nullable', 'string', 'max:10'],
            'max_attendees' => ['required', 'integer', 'min:1', 'max:20'],
        ];
    }
}
