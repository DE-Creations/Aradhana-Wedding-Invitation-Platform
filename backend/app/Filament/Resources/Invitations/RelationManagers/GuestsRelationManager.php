<?php

namespace App\Filament\Resources\Invitations\RelationManagers;

use App\Jobs\SendInvitationEmail;
use App\Jobs\SendRsvpReminder;
use App\Models\Guest;
use App\Support\GuestCsvImporter;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class GuestsRelationManager extends RelationManager
{
    protected static string $relationship = 'guests';

    protected static ?string $title = 'Guests';

    public function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->required()->maxLength(255),
            TextInput::make('email')->email()->maxLength(255),
            TextInput::make('phone')->tel()->maxLength(32),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            // Eager load relationships used by columns to avoid N+1 queries:
            // `invitation` is read by the personalized_url accessor, and `rsvp`
            // is used by the RSVP column and the reminder action visibility.
            ->modifyQueryUsing(fn (Builder $query) => $query->with(['invitation', 'rsvp']))
            ->columns([
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('email')->searchable()->toggleable(),
                TextColumn::make('phone')->toggleable(),
                TextColumn::make('token')
                    ->label('Token')
                    ->formatStateUsing(fn (string $state) => substr($state, 0, 6) . '…')
                    ->copyable()
                    ->copyableState(fn (Guest $record) => $record->token)
                    ->tooltip('Click to copy full token'),
                TextColumn::make('personalized_url')
                    ->label('Personal Link')
                    ->state(fn (Guest $record) => $record->personalized_url)
                    ->copyable()
                    ->limit(24)
                    ->tooltip('Click to copy personalized invitation link'),
                IconColumn::make('invitation_sent')
                    ->label('Invited')
                    ->boolean(),
                TextColumn::make('rsvp.attendance')
                    ->label('RSVP')
                    ->badge()
                    ->placeholder('Pending')
                    ->color(fn (?string $state) => match ($state) {
                        'accepted' => 'success',
                        'declined' => 'danger',
                        default => 'gray',
                    }),
            ])
            ->headerActions([
                CreateAction::make(),
                Action::make('importCsv')
                    ->label('Import CSV')
                    ->icon('heroicon-o-arrow-up-tray')
                    ->schema([
                        FileUpload::make('file')
                            ->label('CSV file (columns: name, email, phone)')
                            ->acceptedFileTypes(['text/csv', 'text/plain'])
                            ->storeFiles(false)
                            ->required(),
                    ])
                    ->action(function (array $data): void {
                        $file = $data['file'];
                        $result = GuestCsvImporter::import($this->getOwnerRecord(), $file->getRealPath());

                        Notification::make()
                            ->title("Imported {$result['imported']} guest(s), skipped {$result['skipped']}.")
                            ->success()
                            ->send();
                    }),
            ])
            ->recordActions([
                Action::make('sendInvitation')
                    ->label('Send')
                    ->icon('heroicon-o-paper-airplane')
                    ->requiresConfirmation()
                    ->visible(fn (Guest $record) => filled($record->email))
                    ->action(function (Guest $record): void {
                        SendInvitationEmail::dispatch($record);
                        Notification::make()->title('Invitation queued.')->success()->send();
                    }),
                Action::make('sendReminder')
                    ->label('Remind')
                    ->icon('heroicon-o-bell')
                    ->requiresConfirmation()
                    ->visible(fn (Guest $record) => filled($record->email) && $record->rsvp === null)
                    ->action(function (Guest $record): void {
                        SendRsvpReminder::dispatch($record);
                        Notification::make()->title('Reminder queued.')->success()->send();
                    }),
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('sendInvitations')
                        ->label('Send Invitations')
                        ->icon('heroicon-o-paper-airplane')
                        ->requiresConfirmation()
                        ->action(function (Collection $records): void {
                            $count = 0;
                            foreach ($records as $record) {
                                if (filled($record->email)) {
                                    SendInvitationEmail::dispatch($record);
                                    $count++;
                                }
                            }
                            Notification::make()->title("{$count} invitation(s) queued.")->success()->send();
                        })
                        ->deselectRecordsAfterCompletion(),
                    BulkAction::make('sendReminders')
                        ->label('Send Reminders')
                        ->icon('heroicon-o-bell')
                        ->requiresConfirmation()
                        ->action(function (Collection $records): void {
                            $count = 0;
                            foreach ($records as $record) {
                                if (filled($record->email) && $record->rsvp === null) {
                                    SendRsvpReminder::dispatch($record);
                                    $count++;
                                }
                            }
                            Notification::make()->title("{$count} reminder(s) queued.")->success()->send();
                        })
                        ->deselectRecordsAfterCompletion(),
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
