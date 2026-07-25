<?php

namespace App\Support;

use App\Models\Invitation;

class GuestCsvImporter
{
    /**
     * Import guests from a CSV file into an invitation.
     * The CSV must have a header row containing at least a "name" column.
     * Recognised columns: name, email, phone.
     *
     * @return array{imported: int, skipped: int}
     */
    public static function import(Invitation $invitation, string $path): array
    {
        $imported = 0;
        $skipped = 0;

        $handle = fopen($path, 'r');
        if ($handle === false) {
            return ['imported' => 0, 'skipped' => 0];
        }

        $header = null;

        while (($row = fgetcsv($handle)) !== false) {
            // Skip completely empty lines.
            if ($row === [null] || $row === false) {
                continue;
            }

            if ($header === null) {
                $header = array_map(
                    fn ($h) => strtolower(trim((string) $h)),
                    $row
                );

                continue;
            }

            $data = self::mapRow($header, $row);
            $name = trim((string) ($data['name'] ?? ''));

            if ($name === '') {
                $skipped++;

                continue;
            }

            $invitation->guests()->create([
                'name' => strip_tags($name),
                'email' => ! empty($data['email']) ? trim($data['email']) : null,
                'phone' => ! empty($data['phone']) ? trim($data['phone']) : null,
            ]);
            $imported++;
        }

        fclose($handle);

        return ['imported' => $imported, 'skipped' => $skipped];
    }

    /**
     * @param  array<int, string>  $header
     * @param  array<int, string|null>  $row
     * @return array<string, string|null>
     */
    private static function mapRow(array $header, array $row): array
    {
        $data = [];
        foreach ($header as $index => $key) {
            $data[$key] = $row[$index] ?? null;
        }

        return $data;
    }
}
