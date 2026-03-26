<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\FindTableController;
use App\Http\Controllers\PublicInvitationController;
use App\Http\Controllers\ShareMemoriesController;
use App\Http\Controllers\PublicMemoryController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\DesignController;
use App\Http\Controllers\User\GuestController;
use App\Http\Controllers\User\MemoryController;
use App\Http\Controllers\User\TableController;
use App\Http\Controllers\User\WeddingSettingsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Public / Auth ──────────────────────────────────────────────────────────

Route::get('/', fn () => Inertia::render('auth/UserLogin'))->name('home');
Route::get('/login', fn () => Inertia::render('auth/UserLogin'))->name('login');
Route::post('/login', [UserAuthController::class, 'login'])->name('login.post');
Route::post('/logout', [UserAuthController::class, 'logout'])->name('logout');

Route::get('/admin/login', fn () => Inertia::render('auth/AdminLogin'))->name('admin.login');
Route::post('/admin/login', [AdminAuthController::class, 'login'])->name('admin.login.post');
Route::post('/admin/logout', [AdminAuthController::class, 'logout'])->name('admin.logout');

// ─── Public Invitation Pages ─────────────────────────────────────────────────

Route::get('/invitation/{token}', [PublicInvitationController::class, 'show'])->name('invitation.show');
Route::post('/invitation/{token}/rsvp', [PublicInvitationController::class, 'submitRsvp'])->name('invitation.rsvp');
Route::post('/invitation/{token}/rsvp-click', [PublicInvitationController::class, 'trackRsvpClick'])->name('invitation.rsvp-click');
Route::get('/find-table', [FindTableController::class, 'index'])->name('guest.find-table');
Route::get('/find-table/search', [FindTableController::class, 'search'])->name('guest.find-table.search');
Route::get('/share-memories', [ShareMemoriesController::class, 'index'])->name('guest.share-memories');
Route::get('/share-memories/search', [ShareMemoriesController::class, 'search'])->name('guest.share-memories.search');
Route::post('/share-memories/upload', [PublicMemoryController::class, 'upload'])->name('guest.upload-memory');

// ─── User Panel (protected) ──────────────────────────────────────────────────

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Settings
    Route::get('/settings', [WeddingSettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [WeddingSettingsController::class, 'update'])->name('settings.update');
    Route::post('/settings/main-image', [WeddingSettingsController::class, 'uploadMainImage'])->name('settings.main-image');
    Route::post('/settings/main-image/destroy', [WeddingSettingsController::class, 'deleteMainImage'])->name('settings.main-image.destroy');
    Route::post('/settings/gallery', [WeddingSettingsController::class, 'addGalleryImage'])->name('settings.gallery.add');
    Route::post('/settings/gallery/{image}/destroy', [WeddingSettingsController::class, 'removeGalleryImage'])->name('settings.gallery.destroy');

    // Guests
    Route::get('/guests', [GuestController::class, 'index'])->name('guests.index');
    Route::get('/guests/export', [GuestController::class, 'export'])->name('guests.export');
    Route::post('/guests/import', [GuestController::class, 'import'])->name('guests.import');
    Route::post('/guests', [GuestController::class, 'store'])->name('guests.store');
    Route::post('/guests/{guest}', [GuestController::class, 'update'])->name('guests.update');
    Route::post('/guests/{guest}/destroy', [GuestController::class, 'destroy'])->name('guests.destroy');

    // Tables
    Route::get('/tables', [TableController::class, 'index'])->name('tables.index');
    Route::post('/tables', [TableController::class, 'store'])->name('tables.store');
    Route::post('/tables/{table}', [TableController::class, 'update'])->name('tables.update');
    Route::post('/tables/{table}/destroy', [TableController::class, 'destroy'])->name('tables.destroy');
    Route::post('/tables/{table}/assign', [TableController::class, 'assign'])->name('tables.assign');
    Route::post('/tables/{table}/unassign', [TableController::class, 'unassign'])->name('tables.unassign');

    // Memories
    Route::get('/memories', [MemoryController::class, 'index'])->name('memories.index');
    Route::get('/memories/download-all', [MemoryController::class, 'downloadAll'])->name('memories.download-all');
    Route::post('/memories/{memory}/approve', [MemoryController::class, 'approve'])->name('memories.approve');
    Route::post('/memories/{memory}/reject', [MemoryController::class, 'reject'])->name('memories.reject');
    Route::post('/memories/batch', [MemoryController::class, 'batchUpdate'])->name('memories.batch');
    Route::post('/memories/{memory}/destroy', [MemoryController::class, 'destroy'])->name('memories.destroy');

    // Design
    Route::get('/design', [DesignController::class, 'index'])->name('design.index');
    Route::get('/design/preview', [DesignController::class, 'preview'])->name('design.preview');
});

// ─── Admin Panel ─────────────────────────────────────────────────────────────

Route::prefix('admin')->middleware('auth:admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/users', [UserManagementController::class, 'index'])->name('admin.users.index');
    Route::post('/users', [UserManagementController::class, 'store'])->name('admin.users.store');
    Route::post('/users/{user}', [UserManagementController::class, 'update'])->name('admin.users.update');
    Route::post('/users/{user}/status', [UserManagementController::class, 'toggleStatus'])->name('admin.users.toggle-status');
    Route::post('/users/{user}/destroy', [UserManagementController::class, 'destroy'])->name('admin.users.destroy');
});

