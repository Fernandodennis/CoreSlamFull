<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;


class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => 'required|string|max:55',
            'email' => 'required|email|unique:users,email,' . $this->id,
            'password' => [
                'nullable',           // Optional if user doesn't want to change it
                'confirmed',          // Requires password_confirmation
                Password::min(8)->letters()
            ],
        ];
    }
}
