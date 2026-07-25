<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->label('Email address')
                    ->searchable(),
                TextColumn::make('role')
                    ->badge()
                    ->color(fn (string $state) => $state === 'admin' ? 'warning' : 'gray'),
                TextColumn::make('subscription_plan')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'premium' => 'success',
                        'basic' => 'info',
                        default => 'gray',
                    }),
                TextColumn::make('invitations_count')
                    ->counts('invitations')
                    ->label('Invitations')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('role')
                    ->options(['admin' => 'Admin', 'user' => 'User']),
                SelectFilter::make('subscription_plan')
                    ->options(['free' => 'Free', 'basic' => 'Basic', 'premium' => 'Premium']),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
