<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Outgoing email
    |--------------------------------------------------------------------------
    |
    | Master switch for every email the app sends (welcome mail, big-day
    | wishes, expiry reminders, mail:test). Off by default. Turn it on with
    | MAIL_ENABLED=true in .env, then run `php artisan config:clear`.
    |
    */

    'mail_enabled' => (bool) env('MAIL_ENABLED', false),

];
