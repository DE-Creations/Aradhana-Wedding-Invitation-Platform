<?php

namespace App\Filament\Resources\Invitations\Schemas;

use App\Filament\Shared\InvitationFormSchema;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class InvitationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            // Admin-only ownership + status controls.
            Section::make('Ownership & Status')
                ->schema([
                    Select::make('user_id')
                        ->relationship('user', 'name')
                        ->searchable()
                        ->preload()
                        ->required(),
                    Select::make('status')
                        ->options(['draft' => 'Draft', 'published' => 'Published', 'expired' => 'Expired'])
                        ->default('draft')
                        ->required(),
                ])
                ->columns(2)
                ->columnSpanFull(),

            ...InvitationFormSchema::components(),
        ]);
    }
}
