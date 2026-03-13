<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = Auth::user();
        $wedding = $user?->wedding;

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id'     => $user->id,
                    'name'   => $user->name,
                    'email'  => $user->email,
                    'status' => $user->status,
                ] : null,
                'wedding' => $wedding ? [
                    'id'             => $wedding->id,
                    'bride_name'     => $wedding->bride_name,
                    'groom_name'     => $wedding->groom_name,
                    'event_token'    => $wedding->event_token,
                    'template_key'   => $wedding->template_key,
                    'typography_key' => $wedding->typography_key,
                    'event_date'     => $wedding->event_date?->toDateString(),
                    'venue_name'     => $wedding->venue_name,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ]);
    }
}
