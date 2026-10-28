<?php

namespace App\Support;

use App\Models\Guest;
use App\Models\Wedding;
use Carbon\CarbonInterface;

/**
 * Decides what the public invitation shows in its "Your Table" section.
 *
 * The table label is only ever returned on or after the event date, so it
 * cannot be read from the page data ahead of time.
 */
class TableInfoResolver
{
    public const STATE_NO_GUEST = 'no_guest';
    public const STATE_BEFORE_EVENT = 'before_event';
    public const STATE_UNASSIGNED = 'unassigned';
    public const STATE_ASSIGNED = 'assigned';

    /**
     * @return array{enabled: bool, state?: string, table_name?: string|null, event_date?: string|null}
     */
    public static function forWedding(Wedding $wedding, ?Guest $guest, bool $enabled): array
    {
        return self::resolve(
            enabled: $enabled,
            hasGuest: $guest !== null,
            eventDate: $wedding->primaryEventDate(),
            tableName: $guest?->table?->table_name,
        );
    }

    /**
     * @return array{enabled: bool, state?: string, table_name?: string|null, event_date?: string|null}
     */
    public static function resolve(
        bool $enabled,
        bool $hasGuest,
        ?CarbonInterface $eventDate,
        ?string $tableName,
        ?CarbonInterface $now = null,
    ): array {
        if (! $enabled) {
            return ['enabled' => false];
        }

        $eventDay = $eventDate?->toDateString();

        if (! $hasGuest) {
            return ['enabled' => true, 'state' => self::STATE_NO_GUEST, 'table_name' => null, 'event_date' => $eventDay];
        }

        $today = ($now ?? now())->toDateString();

        if ($eventDay !== null && $today < $eventDay) {
            return ['enabled' => true, 'state' => self::STATE_BEFORE_EVENT, 'table_name' => null, 'event_date' => $eventDay];
        }

        if ($tableName === null || trim($tableName) === '') {
            return ['enabled' => true, 'state' => self::STATE_UNASSIGNED, 'table_name' => null, 'event_date' => $eventDay];
        }

        return ['enabled' => true, 'state' => self::STATE_ASSIGNED, 'table_name' => $tableName, 'event_date' => $eventDay];
    }
}
