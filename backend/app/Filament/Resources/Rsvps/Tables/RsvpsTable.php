<?php

namespace App\Filament\Resources\Rsvps\Tables;

use App\Models\Rsvp;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RsvpsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('guest_name')
                    ->label('Guest')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('invitation')
                    ->label('Invitation')
                    ->formatStateUsing(fn ($state, Rsvp $record) => $record->invitation
                        ? "{$record->invitation->groom_name} & {$record->invitation->bride_name}"
                        : '—')
                    ->searchable(false),
                TextColumn::make('attendance')
                    ->badge()
                    ->color(fn (string $state) => $state === 'accepted' ? 'success' : 'danger')
                    ->sortable(),
                TextColumn::make('number_of_guests')
                    ->label('Guests')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('dietary_requirements')
                    ->label('Dietary')
                    ->limit(30)
                    ->toggleable(),
                TextColumn::make('responded_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('attendance')
                    ->options(['accepted' => 'Accepted', 'declined' => 'Declined']),
                SelectFilter::make('invitation')
                    ->relationship('invitation', 'groom_name')
                    ->searchable()
                    ->preload(),
            ])
            ->headerActions([
                self::exportAction(),
            ])
            ->recordActions([])
            ->toolbarActions([])
            ->defaultSort('responded_at', 'desc');
    }

    private static function exportAction(): Action
    {
        return Action::make('exportCsv')
            ->label('Export to CSV')
            ->icon('heroicon-o-arrow-down-tray')
            ->action(function (): StreamedResponse {
                $filename = 'rsvps-' . now()->format('Ymd-His') . '.csv';

                return response()->streamDownload(function () {
                    $handle = fopen('php://output', 'w');
                    fputcsv($handle, ['Guest', 'Invitation', 'Attendance', 'Guests', 'Dietary', 'Message', 'Responded At']);

                    Rsvp::query()->with('invitation')->latest('responded_at')->chunk(200, function ($rsvps) use ($handle) {
                        foreach ($rsvps as $rsvp) {
                            fputcsv($handle, [
                                $rsvp->guest_name,
                                $rsvp->invitation ? "{$rsvp->invitation->groom_name} & {$rsvp->invitation->bride_name}" : '',
                                $rsvp->attendance,
                                $rsvp->number_of_guests,
                                $rsvp->dietary_requirements,
                                $rsvp->message,
                                optional($rsvp->responded_at)->toDateTimeString(),
                            ]);
                        }
                    });

                    fclose($handle);
                }, $filename, ['Content-Type' => 'text/csv']);
            });
    }
}
