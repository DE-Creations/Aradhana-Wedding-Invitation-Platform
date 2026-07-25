<?php

namespace App\Filament\Resources\Invitations\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class InvitationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                TextColumn::make('couple')
                    ->label('Couple')
                    ->state(fn ($record) => "{$record->groom_name} & {$record->bride_name}")
                    ->searchable(['groom_name', 'bride_name']),
                TextColumn::make('user.name')
                    ->label('Owner')
                    ->searchable()
                    ->toggleable(),
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
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('event_type')
                    ->options([
                        'wedding' => 'Wedding',
                        'birthday' => 'Birthday',
                        'anniversary' => 'Anniversary',
                        'grand_opening' => 'Grand Opening',
                    ]),
                SelectFilter::make('status')
                    ->options(['draft' => 'Draft', 'published' => 'Published', 'expired' => 'Expired']),
                SelectFilter::make('user')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
