<?php

namespace App\Console\Commands;

use App\Models\Invitation;
use Illuminate\Console\Command;

class ExpireInvitations extends Command
{
    protected $signature = 'invitations:expire';

    protected $description = 'Mark published invitations as expired once their ceremony date has passed by more than a day';

    public function handle(): int
    {
        $cutoff = now()->subDay();

        $count = Invitation::query()
            ->where('status', 'published')
            ->where('ceremony_date', '<', $cutoff)
            ->update([
                'status' => 'expired',
                'expires_at' => now(),
            ]);

        $this->info("Expired {$count} invitation(s).");

        return self::SUCCESS;
    }
}
