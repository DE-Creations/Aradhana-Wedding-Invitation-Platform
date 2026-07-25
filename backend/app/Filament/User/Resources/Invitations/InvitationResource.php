<?php

namespace App\Filament\User\Resources\Invitations;

use App\Filament\Resources\Invitations\RelationManagers\GuestsRelationManager;
use App\Filament\Resources\Invitations\RelationManagers\RsvpsRelationManager;
use App\Filament\User\Resources\Invitations\Pages\CreateInvitation;
use App\Filament\User\Resources\Invitations\Pages\EditInvitation;
use App\Filament\User\Resources\Invitations\Pages\ListInvitations;
use App\Filament\User\Resources\Invitations\Schemas\InvitationForm;
use App\Filament\User\Resources\Invitations\Tables\InvitationsTable;
use App\Models\Invitation;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class InvitationResource extends Resource
{
    protected static ?string $model = Invitation::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedEnvelopeOpen;

    protected static ?string $navigationLabel = 'My Invitations';

    protected static ?string $recordTitleAttribute = 'groom_name';

    /**
     * Users only ever see and manage their own invitations.
     */
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->where('user_id', auth()->id());
    }

    public static function form(Schema $schema): Schema
    {
        return InvitationForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return InvitationsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            GuestsRelationManager::class,
            RsvpsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListInvitations::route('/'),
            'create' => CreateInvitation::route('/create'),
            'edit' => EditInvitation::route('/{record}/edit'),
        ];
    }
}
