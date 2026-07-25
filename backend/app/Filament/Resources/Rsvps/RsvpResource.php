<?php

namespace App\Filament\Resources\Rsvps;

use App\Filament\Resources\Rsvps\Pages\ListRsvps;
use App\Filament\Resources\Rsvps\Tables\RsvpsTable;
use App\Models\Rsvp;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class RsvpResource extends Resource
{
    protected static ?string $model = Rsvp::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentCheck;

    protected static ?int $navigationSort = 3;

    public static function table(Table $table): Table
    {
        return RsvpsTable::configure($table);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRsvps::route('/'),
        ];
    }
}
