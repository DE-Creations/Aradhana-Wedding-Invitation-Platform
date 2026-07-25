<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->maxLength(255),
                TextInput::make('phone')
                    ->tel()
                    ->maxLength(32),
                Select::make('role')
                    ->options(['admin' => 'Admin', 'user' => 'User'])
                    ->default('user')
                    ->required(),
                Select::make('subscription_plan')
                    ->options(['free' => 'Free', 'basic' => 'Basic', 'premium' => 'Premium'])
                    ->default('free')
                    ->required(),
                TextInput::make('password')
                    ->password()
                    ->revealable()
                    ->dehydrateStateUsing(fn (?string $state) => filled($state) ? Hash::make($state) : null)
                    ->dehydrated(fn (?string $state) => filled($state))
                    ->required(fn (string $operation) => $operation === 'create')
                    ->helperText('Leave blank to keep the current password when editing.')
                    ->maxLength(255),
            ]);
    }
}
