<?php

namespace App\Filament\Widgets;

use App\Models\Invitation;
use App\Models\Rsvp;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected ?string $pollingInterval = null;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::count())
                ->description('Registered accounts')
                ->color('primary'),

            Stat::make('Total Invitations', Invitation::count())
                ->description('Across all users')
                ->color('success'),

            Stat::make('Total RSVPs', Rsvp::count())
                ->description('Guest responses')
                ->color('info'),

            Stat::make('Invitations This Month', Invitation::whereBetween('created_at', [
                now()->startOfMonth(), now()->endOfMonth(),
            ])->count())
                ->description(now()->format('F Y'))
                ->color('warning'),
        ];
    }
}
