<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withSchedule(function (\Illuminate\Console\Scheduling\Schedule $schedule): void {
        $schedule->command('users:expire')->daily();
        $schedule->command('mail:big-day-wishes')->dailyAt('08:00');
        $schedule->command('mail:expiry-reminder')->dailyAt('09:00');
    })
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->validateCsrfTokens(except: [
            '/guest-search/upload-memory',
        ]);
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // 404 — route or resource not found
        $exceptions->render(function (
            \Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e,
            Request $request,
        ) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Not found.'], 404);
            }
            return Inertia::render('NotFound', ['status' => 404])
                ->toResponse($request)
                ->setStatusCode(404);
        });

        // Model not found (e.g. findOrFail)
        $exceptions->render(function (
            \Illuminate\Database\Eloquent\ModelNotFoundException $e,
            Request $request,
        ) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Resource not found.'], 404);
            }
            return Inertia::render('NotFound', ['status' => 404])
                ->toResponse($request)
                ->setStatusCode(404);
        });

        // 403 — access denied (abort(403) / HTTP exception)
        $exceptions->render(function (
            \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException $e,
            Request $request,
        ) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Access denied.'], 403);
            }
            return Inertia::render('NotFound', ['status' => 403])
                ->toResponse($request)
                ->setStatusCode(403);
        });

        // 403 — policy / gate authorization failure
        $exceptions->render(function (
            \Illuminate\Auth\Access\AuthorizationException $e,
            Request $request,
        ) {
            if ($request->expectsJson()) {
                return response()->json(['error' => 'Unauthorized.'], 403);
            }
            return Inertia::render('NotFound', ['status' => 403])
                ->toResponse($request)
                ->setStatusCode(403);
        });
    })->create();
