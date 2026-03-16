<?php

namespace App\Console\Commands;

use App\Models\Memory;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ExpireUsersCommand extends Command
{
    protected $signature = 'users:expire';

    protected $description = 'Mark users as expired when their expire_date has passed and clean up their wedding image files.';

    public function handle(): int
    {
        $users = User::query()
            ->whereNotNull('expire_date')
            ->where('expire_date', '<=', now())
            ->where('status', '!=', 'expired')
            ->with(['wedding.galleryImages', 'wedding.memories'])
            ->get();

        $count = 0;

        foreach ($users as $user) {
            $wedding = $user->wedding;

            if ($wedding) {
                // Delete main image
                if ($wedding->main_image && Storage::disk('public')->exists($wedding->main_image)) {
                    Storage::disk('public')->delete($wedding->main_image);
                    $wedding->update(['main_image' => null]);
                }

                // Delete gallery images
                foreach ($wedding->galleryImages as $img) {
                    if (Storage::disk('public')->exists($img->image_path)) {
                        Storage::disk('public')->delete($img->image_path);
                    }
                }
                $wedding->galleryImages()->delete();

                // Delete memory images
                foreach ($wedding->memories as $memory) {
                    if ($memory->image_path && Storage::disk('public')->exists($memory->image_path)) {
                        Storage::disk('public')->delete($memory->image_path);
                    }
                }
                $wedding->memories()->delete();
            }

            $user->update(['status' => 'expired']);
            $count++;
        }

        $this->info("Expired {$count} user(s).");

        return self::SUCCESS;
    }
}
