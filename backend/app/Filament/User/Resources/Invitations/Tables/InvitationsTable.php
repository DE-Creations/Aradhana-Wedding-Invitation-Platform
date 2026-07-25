<?php

namespace App\Filament\User\Resources\Invitations\Tables;

use App\Models\Invitation;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class InvitationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('couple')
                    ->label('Couple')
                    ->state(fn (Invitation $record) => "{$record->groom_name} & {$record->bride_name}")
                    ->searchable(['groom_name', 'bride_name']),
                TextColumn::make('event_type')
                    ->badge()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'published' => 'success',
                        'draft' => 'warning',
                        'expired' => 'danger',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('views_count')
                    ->label('Views')
                    ->sortable(),
                TextColumn::make('rsvps_count')
                    ->counts('rsvps')
                    ->label('RSVPs')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options(['draft' => 'Draft', 'published' => 'Published', 'expired' => 'Expired']),
                SelectFilter::make('event_type')
                    ->options([
                        'wedding' => 'Wedding',
                        'birthday' => 'Birthday',
                        'anniversary' => 'Anniversary',
                        'grand_opening' => 'Grand Opening',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
                ActionGroup::make([
                    Action::make('publish')
                        ->label('Publish')
                        ->icon('heroicon-o-globe-alt')
                        ->color('success')
                        ->requiresConfirmation()
                        ->visible(fn (Invitation $record) => $record->status !== 'published')
                        ->action(function (Invitation $record): void {
                            $record->update([
                                'status' => 'published',
                                'published_at' => $record->published_at ?? now(),
                            ]);
                            Notification::make()->title('Invitation published.')->success()->send();
                        }),
                    Action::make('unpublish')
                        ->label('Unpublish')
                        ->icon('heroicon-o-eye-slash')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->visible(fn (Invitation $record) => $record->status === 'published')
                        ->action(function (Invitation $record): void {
                            $record->update(['status' => 'draft']);
                            Notification::make()->title('Invitation unpublished.')->success()->send();
                        }),
                    Action::make('copyLink')
                        ->label('Copy Link')
                        ->icon('heroicon-o-link')
                        ->color('gray')
                        ->extraAttributes(fn (Invitation $record) => [
                            'x-on:click' => 'window.navigator.clipboard.writeText(' . json_encode($record->public_url) . ')',
                        ]),
                    Action::make('preview')
                        ->label('Preview')
                        ->icon('heroicon-o-arrow-top-right-on-square')
                        ->color('gray')
                        ->url(fn (Invitation $record) => $record->public_url)
                        ->openUrlInNewTab(),
                    DeleteAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
