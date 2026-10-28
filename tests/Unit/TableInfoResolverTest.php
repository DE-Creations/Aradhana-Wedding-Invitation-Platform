<?php

use App\Support\TableInfoResolver;
use Carbon\Carbon;

$eventDate = Carbon::parse('2026-12-03');

it('returns only enabled=false when Table Management is off', function () use ($eventDate) {
    $info = TableInfoResolver::resolve(false, true, $eventDate, 'Table 01', Carbon::parse('2026-12-03'));

    expect($info)->toBe(['enabled' => false]);
});

it('asks for the personal link when no guest is identified', function () use ($eventDate) {
    $info = TableInfoResolver::resolve(true, false, $eventDate, null, Carbon::parse('2026-12-03'));

    expect($info['state'])->toBe('no_guest')
        ->and($info['table_name'])->toBeNull();
});

it('hides the table before the event date even when one is assigned', function () use ($eventDate) {
    $info = TableInfoResolver::resolve(true, true, $eventDate, 'Table 01', Carbon::parse('2026-12-02 23:59'));

    expect($info['state'])->toBe('before_event')
        ->and($info['table_name'])->toBeNull()
        ->and($info['event_date'])->toBe('2026-12-03');
});

it('reports an unassigned guest on the event day', function () use ($eventDate) {
    $info = TableInfoResolver::resolve(true, true, $eventDate, null, Carbon::parse('2026-12-03 08:00'));

    expect($info['state'])->toBe('unassigned')
        ->and($info['table_name'])->toBeNull();
});

it('treats a blank table name as unassigned', function () use ($eventDate) {
    $info = TableInfoResolver::resolve(true, true, $eventDate, '  ', Carbon::parse('2026-12-03'));

    expect($info['state'])->toBe('unassigned');
});

it('reveals the table on the event day', function () use ($eventDate) {
    $info = TableInfoResolver::resolve(true, true, $eventDate, 'Table 01', Carbon::parse('2026-12-03 00:00'));

    expect($info['state'])->toBe('assigned')
        ->and($info['table_name'])->toBe('Table 01');
});

it('keeps showing the table after the event day', function () use ($eventDate) {
    $info = TableInfoResolver::resolve(true, true, $eventDate, 'Table 01', Carbon::parse('2026-12-10'));

    expect($info['state'])->toBe('assigned');
});

it('treats a wedding without an event date as event day', function () {
    $info = TableInfoResolver::resolve(true, true, null, 'Table 01', Carbon::parse('2026-01-01'));

    expect($info['state'])->toBe('assigned')
        ->and($info['event_date'])->toBeNull();
});
