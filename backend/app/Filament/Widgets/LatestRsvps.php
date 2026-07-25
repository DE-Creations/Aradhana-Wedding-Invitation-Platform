<?php

namespace App\Filament\Widgets;

use App\Models\Rsvp;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestRsvps extends TableWidget
{
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Latest RSVPs')
            ->query(
                Rsvp::query()->with('invitation')->latest('responded_at')->limit(10)
            )
            ->columns([
                TextColumn::make('guest_name')
                    ->label('Guest')
                    ->searchable(),
                TextColumn::make('invitation')
                    ->label('Invitation')
                    ->formatStateUsing(fn ($state, Rsvp $record) => $record->invitation
                        ? "{$record->invitation->groom_name} & {$record->invitation->bride_name}"
                        : '—'),
                TextColumn::make('attendance')
                    ->badge()
                    ->color(fn (string $state) => $state === 'accepted' ? 'success' : 'danger'),
                TextColumn::make('number_of_guests')
                    ->label('Guests'),
                TextColumn::make('responded_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->paginated(false);
    }

    protected function getTableQuery(): ?Builder
    {
        return Rsvp::query()->with('invitation')->latest('responded_at')->limit(10);
    }
}
