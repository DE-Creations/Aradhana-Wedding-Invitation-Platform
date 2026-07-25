<?php

namespace App\Filament\Widgets;

use App\Models\Invitation;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class InvitationsPerMonthChart extends ChartWidget
{
    protected ?string $heading = 'Invitations Created (Last 12 Months)';

    protected int | string | array $columnSpan = 'full';

    protected function getType(): string
    {
        return 'line';
    }

    protected function getData(): array
    {
        $labels = [];
        $values = [];

        for ($i = 11; $i >= 0; $i--) {
            $month = Carbon::now()->startOfMonth()->subMonths($i);
            $labels[] = $month->format('M Y');
            $values[] = Invitation::whereBetween('created_at', [
                $month->copy()->startOfMonth(),
                $month->copy()->endOfMonth(),
            ])->count();
        }

        return [
            'datasets' => [
                [
                    'label' => 'Invitations',
                    'data' => $values,
                    'borderColor' => '#C9A96E',
                    'backgroundColor' => 'rgba(201, 169, 110, 0.2)',
                    'fill' => true,
                    'tension' => 0.3,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
