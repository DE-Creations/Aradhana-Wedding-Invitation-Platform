<?php

namespace App\Providers;

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
        // Safety net: with email switched off, any Mail:: call that was missed goes to the
        // array mailer (discarded) instead of reaching SMTP.
        if (! config('features.mail_enabled')) {
            config(['mail.default' => 'array']);
        }
    }
}
