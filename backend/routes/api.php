<?php

use App\Http\Controllers\Api\GuestImportController;
use App\Http\Controllers\Api\InvitationController;
use App\Http\Controllers\Api\RsvpController;
use App\Http\Controllers\Api\UserInvitationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API (no auth) — throttled to 60 req/min
|--------------------------------------------------------------------------
*/
Route::middleware('throttle:public')->group(function () {
    Route::get('/invitations/{slug}', [InvitationController::class, 'show']);
    Route::get('/invitations/{slug}/guest/{token}', [InvitationController::class, 'showForGuest']);
    Route::post('/rsvp', [RsvpController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Authenticated API (Sanctum) — throttled to 120 req/min
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());

    Route::get('/user/invitations', [UserInvitationController::class, 'index']);
    Route::post('/user/invitations', [UserInvitationController::class, 'store']);
    Route::put('/user/invitations/{invitation}', [UserInvitationController::class, 'update']);
    Route::delete('/user/invitations/{invitation}', [UserInvitationController::class, 'destroy']);

    Route::post('/user/invitations/{invitation}/guests/import', [GuestImportController::class, 'store']);
});
