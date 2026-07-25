<?php

namespace App\Filament\Resources\Invitations\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\Summarizers\Sum;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class RsvpsRelationManager extends RelationManager
{
    protected static string $relationship = 'rsvps';

    protected static ?string $title = 'RSVPs';

    public function isReadOnly(): bool
    {
        return true;
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('guest_name')
            ->columns([
                TextColumn::make('guest_name')->label('Guest')->searchable()->sortable(),
                TextColumn::make('attendance')
                    ->badge()
                    ->color(fn (string $state) => $state === 'accepted' ? 'success' : 'danger'),
                TextColumn::make('number_of_guests')
                    ->label('Guests')
                    ->summarize(Sum::make()->label('Total attending')),
                TextColumn::make('dietary_requirements')->label('Dietary')->toggleable()->limit(30),
                TextColumn::make('message')->limit(40)->toggleable(),
                TextColumn::make('responded_at')->dateTime()->sortable(),
            ])
            ->filters([
                SelectFilter::make('attendance')
                    ->options(['accepted' => 'Accepted', 'declined' => 'Declined']),
            ])
            ->defaultSort('responded_at', 'desc');
    }
}
