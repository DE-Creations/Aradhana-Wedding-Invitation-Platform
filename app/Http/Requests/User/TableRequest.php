<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class TableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'table_name' => ['required', 'string', 'max:255'],
            'seat_count' => ['required', 'integer', 'min:1', 'max:200'],
        ];
    }
}
