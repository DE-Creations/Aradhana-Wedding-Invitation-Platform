<?php

namespace App\Filament\Widgets;

use App\Models\Rsvp;
use Filament\Widgets\ChartWidget;

class RsvpBreakdownChart extends ChartWidget
{
    protected ?string $heading = 'RSVPs: Accepted vs Declined';

    protected function getType(): string
    {
        return 'pie';
    }

    protected function getData(): array
    {
        $accepted = Rsvp::where('attendance', 'accepted')->count();
        $declined = Rsvp::where('attendance', 'declined')->count();

        return [
            'datasets' => [
                [
                    'label' => 'RSVPs',
                    'data' => [$accepted, $declined],
                    'backgroundColor' => ['#22c55e', '#ef4444'],
                ],
            ],
            'labels' => ['Accepted', 'Declined'],
        ];
    }
}
