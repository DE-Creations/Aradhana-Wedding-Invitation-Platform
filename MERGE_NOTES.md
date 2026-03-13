# Laravel 12 + React Design Merge Notes

This scaffold replaces the default Laravel Blade frontend with an Inertia + React + TypeScript frontend.

## What was changed
- Removed the default welcome Blade flow and switched to a single Inertia root view.
- Moved the uploaded React design into `resources/js`.
- Replaced local mock page switching with Laravel routes + Inertia visits.
- Switched from Tailwind v4 to Tailwind v3.
- Switched from `@vitejs/plugin-react-swc` to `@vitejs/plugin-react`.
- Removed `react-router-dom` usage from the actual runtime flow.
- Removed browser theme detection by replacing the `next-themes` dependency in the Sonner wrapper.

## Important next steps
1. Run `composer update` to install `inertiajs/inertia-laravel`.
2. Run `npm install` to install the new React / Inertia / Tailwind v3 dependencies.
3. Run `php artisan optimize:clear`.
4. Run `npm run dev` and `php artisan serve`.
5. Start replacing mock data with Laravel controllers, props, and database data.
