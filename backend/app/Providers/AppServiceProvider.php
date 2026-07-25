<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
    }

    private function configureRateLimiting(): void
    {
        // Public endpoints: 60 requests per minute per IP.
        RateLimiter::for('public', fn (Request $request) => Limit::perMinute(60)->by($request->ip()));

        // Authenticated endpoints: 120 requests per minute per user (fallback to IP).
        RateLimiter::for('authenticated', fn (Request $request) => Limit::perMinute(120)
            ->by($request->user()?->id ?: $request->ip()));
    }
}
