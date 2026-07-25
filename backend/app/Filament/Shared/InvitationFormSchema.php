<?php

namespace App\Filament\Shared;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;

class InvitationFormSchema
{
    /**
     * The full tabbed invitation form, shared by the admin and user panels.
     *
     * @return array<int, \Filament\Schemas\Components\Component>
     */
    public static function components(): array
    {
        return [
            Tabs::make('Invitation')
                ->columnSpanFull()
                ->persistTabInQueryString()
                ->tabs([
                    self::basicInfoTab(),
                    self::familyTab(),
                    self::ceremonyTab(),
                    self::receptionTab(),
                    self::contactTab(),
                    self::mediaTab(),
                    self::customizationTab(),
                ]),
        ];
    }

    private static function basicInfoTab(): Tab
    {
        return Tab::make('Basic Info')
            ->schema([
                Select::make('event_type')
                    ->options([
                        'wedding' => 'Wedding',
                        'birthday' => 'Birthday',
                        'anniversary' => 'Anniversary',
                        'grand_opening' => 'Grand Opening',
                    ])
                    ->default('wedding')
                    ->required(),
                Select::make('template')
                    ->options([
                        'royal-wedding' => 'Royal Wedding',
                        'golden-classic' => 'Golden Classic',
                        'rose-elegance' => 'Rose Elegance',
                        'midnight-luxe' => 'Midnight Luxe',
                    ])
                    ->searchable()
                    ->required(),
                TextInput::make('groom_name')->required()->maxLength(255),
                TextInput::make('bride_name')->required()->maxLength(255),
                Textarea::make('message')
                    ->label('Custom Message')
                    ->rows(3)
                    ->maxLength(2000)
                    ->columnSpanFull(),
            ])
            ->columns(2);
    }

    private static function familyTab(): Tab
    {
        return Tab::make('Family')
            ->schema([
                TextInput::make('groom_father')->label("Groom's Father")->maxLength(255),
                TextInput::make('groom_mother')->label("Groom's Mother")->maxLength(255),
                TextInput::make('bride_father')->label("Bride's Father")->maxLength(255),
                TextInput::make('bride_mother')->label("Bride's Mother")->maxLength(255),
            ])
            ->columns(2);
    }

    private static function ceremonyTab(): Tab
    {
        return Tab::make('Ceremony')
            ->schema([
                DateTimePicker::make('ceremony_date')
                    ->seconds(false)
                    ->required()
                    ->columnSpanFull(),
                TextInput::make('ceremony_venue')->required()->maxLength(255),
                TextInput::make('ceremony_address')->required()->maxLength(500),
                TextInput::make('ceremony_lat')->label('Latitude')->numeric()->step('any'),
                TextInput::make('ceremony_lng')->label('Longitude')->numeric()->step('any'),
            ])
            ->columns(2);
    }

    private static function receptionTab(): Tab
    {
        return Tab::make('Reception')
            ->schema([
                DateTimePicker::make('reception_time')
                    ->seconds(false)
                    ->columnSpanFull(),
                TextInput::make('reception_venue')->maxLength(255),
                TextInput::make('reception_address')->maxLength(500),
                TextInput::make('reception_lat')->label('Latitude')->numeric()->step('any'),
                TextInput::make('reception_lng')->label('Longitude')->numeric()->step('any'),
            ])
            ->columns(2);
    }

    private static function contactTab(): Tab
    {
        return Tab::make('Contact')
            ->schema([
                TextInput::make('groom_phone')->tel()->maxLength(32),
                TextInput::make('bride_phone')->tel()->maxLength(32),
            ])
            ->columns(2);
    }

    private static function mediaTab(): Tab
    {
        return Tab::make('Media')
            ->schema([
                FileUpload::make('couple_photo')
                    ->label('Couple Main Photo')
                    ->image()
                    ->directory('photos/couples')
                    ->visibility('public')
                    ->maxSize(5120),
                FileUpload::make('groom_photo')
                    ->image()
                    ->directory('photos/grooms')
                    ->visibility('public')
                    ->maxSize(5120),
                FileUpload::make('bride_photo')
                    ->image()
                    ->directory('photos/brides')
                    ->visibility('public')
                    ->maxSize(5120),
                FileUpload::make('music_url')
                    ->label('Background Music')
                    ->directory('music')
                    ->visibility('public')
                    ->acceptedFileTypes(['audio/mpeg', 'audio/wav', 'audio/ogg'])
                    ->maxSize(10240),
                Repeater::make('galleryPhotos')
                    ->label('Gallery Photos')
                    ->relationship()
                    ->schema([
                        FileUpload::make('photo_path')
                            ->label('Photo')
                            ->image()
                            ->directory('photos/gallery')
                            ->visibility('public')
                            ->maxSize(5120)
                            ->required(),
                        TextInput::make('caption')->maxLength(255),
                    ])
                    ->orderColumn('sort_order')
                    ->reorderable()
                    ->maxItems(20)
                    ->columns(2)
                    ->columnSpanFull(),
            ])
            ->columns(2);
    }

    private static function customizationTab(): Tab
    {
        return Tab::make('Customization')
            ->schema([
                Select::make('particle_type')
                    ->options([
                        'rose_petals' => 'Rose Petals',
                        'stars' => 'Stars',
                        'snowflakes' => 'Snowflakes',
                        'confetti' => 'Confetti',
                        'none' => 'None',
                    ])
                    ->default('rose_petals')
                    ->required(),
                ColorPicker::make('color_primary')->label('Primary Color')->default('#0D0D0D'),
                ColorPicker::make('color_accent')->label('Accent Color')->default('#C9A96E'),
                ColorPicker::make('color_rose')->label('Rose Color')->default('#8B3A4A'),
            ])
            ->columns(2);
    }
}
