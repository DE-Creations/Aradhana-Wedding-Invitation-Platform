<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Wedding;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->latest()
            ->take(10)
            ->get()
            ->map(fn (User $user) => [
                'id'          => (string) $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'status'      => $user->status,
                'expire_date' => $user->expire_date?->toDateString() ?? '',
                'created_at'  => $user->created_at?->toDateString() ?? '',
            ])
            ->values();

        $totalUsers    = User::count();
        $activeUsers   = User::where('status', 'active')->count();
        $expiredUsers  = User::where('status', 'expired')->count();
        $totalWeddings = Wedding::count();

        return Inertia::render('admin/Dashboard', [
            'stats' => [
                'total_users'    => $totalUsers,
                'active_users'   => $activeUsers,
                'expired_users'  => $expiredUsers,
                'total_weddings' => $totalWeddings,
            ],
            'recentUsers' => $users,
        ]);
    }
}
