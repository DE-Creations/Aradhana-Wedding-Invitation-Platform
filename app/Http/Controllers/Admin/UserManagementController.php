<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->latest()
            ->get()
            ->map(fn (User $user) => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'status' => $user->status,
                'expire_date' => $user->expire_date?->toDateString() ?? '',
                'created_at' => $user->created_at?->toDateString() ?? '',
                'updated_at' => $user->updated_at?->toDateString() ?? '',
                'table_management' => (bool) $user->table_management,
                'share_memory' => (bool) $user->share_memory,
                'image_count' => (int) $user->image_count,
            ])
            ->values();

        $weddingsByUserId = Wedding::query()
            ->get()
            ->mapWithKeys(fn (Wedding $wedding) => [
                (string) $wedding->user_id => [
                    'id' => (string) $wedding->id,
                    'bride_name' => $wedding->bride_name,
                    'groom_name' => $wedding->groom_name,
                    'bride_parents_names' => $wedding->bride_parents_names,
                    'groom_parents_names' => $wedding->groom_parents_names,
                    'event_date' => $wedding->event_date?->toDateString() ?? '',
                    'start_time' => $wedding->start_time,
                    'end_time' => $wedding->end_time,
                    'poruwa_time' => $wedding->poruwa_time,
                    'venue_name' => $wedding->venue_name,
                    'venue_address' => $wedding->venue_address,
                    'google_maps_link' => $wedding->google_maps_link,
                    'rsvp_deadline' => $wedding->rsvp_deadline?->toDateString() ?? '',
                    'contact_number_1' => $wedding->contact_number_1,
                    'contact_number_2' => $wedding->contact_number_2,
                    'template_key' => $wedding->template_key,
                    'typography_key' => $wedding->typography_key,
                    'main_image' => $wedding->main_image,
                    'main_image_url' => $this->resolveMainImageUrl($wedding->main_image),
                    'event_token' => $wedding->event_token,
                ],
            ]);

        return Inertia::render('admin/Users', [
            'users' => $users,
            'weddingsByUserId' => $weddingsByUserId,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['required', 'string', 'max:40'],
            'status' => ['required', 'in:active,inactive,expired'],
            'expire_date' => ['nullable', 'date'],

            'bride_name' => ['nullable', 'string', 'max:255'],
            'groom_name' => ['nullable', 'string', 'max:255'],
            'event_date' => ['nullable', 'date'],
            'venue_name' => ['nullable', 'string', 'max:255'],
            'rsvp_deadline' => ['nullable', 'date'],
            'template_key' => ['nullable', 'string', 'max:120'],
            'typography_key' => ['nullable', 'string', 'max:120'],
            'table_management' => ['boolean'],
            'share_memory' => ['boolean'],
            'image_count' => ['nullable', 'integer', 'in:0,20,30'],
            'main_image' => [
                'nullable',
                'image',
                'max:10240',
                'mimes:jpg,jpeg,png,webp',
            ],
        ]);

        $weddingRequested = $this->hasWeddingDetails($validated) || $request->hasFile('main_image');

        if ($weddingRequested) {
            $weddingRequired = $request->validate([
                'bride_name' => ['required', 'string', 'max:255'],
                'groom_name' => ['required', 'string', 'max:255'],
                'event_date' => ['required', 'date'],
                'venue_name' => ['required', 'string', 'max:255'],
            ]);

            $validated = [...$validated, ...$weddingRequired];
        }

        DB::transaction(function () use ($validated, $request, $weddingRequested): void {
            $shareMemory = (bool) ($validated['share_memory'] ?? false);
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'phone' => $validated['phone'],
                'status' => $validated['status'],
                'expire_date' => $validated['expire_date'] ?: null,
                'table_management' => (bool) ($validated['table_management'] ?? false),
                'share_memory' => $shareMemory,
                'image_count' => $shareMemory ? (int) ($validated['image_count'] ?? 20) : 0,
            ]);

            if ($weddingRequested) {
                $mainImagePath = null;

                if ($request->hasFile('main_image')) {
                    $mainImagePath = $this->storeWeddingMainImage($request->file('main_image'));
                }

                Wedding::create([
                    'user_id' => $user->id,
                    'event_token' => $this->buildUniqueEventToken(
                        $validated['bride_name'],
                        $validated['groom_name'],
                        $validated['event_date']
                    ),
                    'bride_name' => $validated['bride_name'],
                    'groom_name' => $validated['groom_name'],
                    'event_date' => $validated['event_date'],
                    'venue_name' => $validated['venue_name'],
                    'rsvp_deadline' => $validated['rsvp_deadline'] ?: null,
                    'template_key' => $validated['template_key'] ?: null,
                    'typography_key' => $validated['typography_key'] ?: null,
                    'main_image' => $mainImagePath,
                    'status' => 'draft',
                ]);
            }
        });

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name'               => ['required', 'string', 'max:255'],
            'email'              => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password'           => ['nullable', 'string', 'min:8'],
            'phone'              => ['required', 'string', 'max:40'],
            'status'             => ['required', 'in:active,inactive,expired'],
            'expire_date'        => ['nullable', 'date'],
            'table_management'   => ['boolean'],
            'share_memory'       => ['boolean'],
            'image_count'        => ['nullable', 'integer', 'in:0,20,30'],

            'bride_name'         => ['nullable', 'string', 'max:255'],
            'groom_name'         => ['nullable', 'string', 'max:255'],
            'event_date'         => ['nullable', 'date'],
            'venue_name'         => ['nullable', 'string', 'max:255'],
            'rsvp_deadline'      => ['nullable', 'date'],
            'template_key'       => ['nullable', 'string', 'max:120'],
            'typography_key'     => ['nullable', 'string', 'max:120'],
        ]);

        $weddingRequested = $this->hasWeddingDetails($validated) || $user->wedding()->exists();

        if ($weddingRequested) {
            $weddingRequired = $request->validate([
                'bride_name' => ['required', 'string', 'max:255'],
                'groom_name' => ['required', 'string', 'max:255'],
                'event_date' => ['required', 'date'],
                'venue_name' => ['required', 'string', 'max:255'],
            ]);

            $validated = [...$validated, ...$weddingRequired];
        }

        DB::transaction(function () use ($validated, $user, $weddingRequested): void {
            $shareMemory = (bool) ($validated['share_memory'] ?? false);
            $userPayload = [
                'name'             => $validated['name'],
                'email'            => $validated['email'],
                'phone'            => $validated['phone'],
                'status'           => $validated['status'],
                'expire_date'      => $validated['expire_date'] ?: null,
                'table_management' => (bool) ($validated['table_management'] ?? false),
                'share_memory'     => $shareMemory,
                'image_count'      => $shareMemory ? (int) ($validated['image_count'] ?? 20) : 0,
            ];

            if (!empty($validated['password'])) {
                $userPayload['password'] = $validated['password'];
            }

            $user->update($userPayload);

            if ($weddingRequested) {
                $wedding = $user->wedding;

                $weddingPayload = [
                    'bride_name'     => $validated['bride_name'],
                    'groom_name'     => $validated['groom_name'],
                    'event_date'     => $validated['event_date'],
                    'venue_name'     => $validated['venue_name'],
                    'rsvp_deadline'  => $validated['rsvp_deadline'] ?: null,
                    'template_key'   => $validated['template_key'] ?: null,
                    'typography_key' => $validated['typography_key'] ?: null,
                    'status'         => $wedding?->status ?? 'draft',
                ];

                if ($wedding) {
                    $wedding->update($weddingPayload);
                } else {
                    Wedding::create([
                        ...$weddingPayload,
                        'user_id'     => $user->id,
                        'event_token' => $this->buildUniqueEventToken(
                            $validated['bride_name'],
                            $validated['groom_name'],
                            $validated['event_date']
                        ),
                    ]);
                }
            }
        });

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function toggleStatus(User $user): RedirectResponse
    {
        $user->status = $user->status === 'active' ? 'inactive' : 'active';
        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'User status updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        return $this->deleteUser($user);
    }

    private function hasWeddingDetails(array $validated): bool
    {
        return !empty($validated['bride_name'])
            || !empty($validated['groom_name'])
            || !empty($validated['event_date'])
            || !empty($validated['venue_name']);
    }

    private function buildUniqueEventToken(string $brideName, string $groomName, string $eventDate): string
    {
        $year = date('Y', strtotime($eventDate));
        $baseToken = Str::slug("{$brideName}-{$groomName}-{$year}");
        $token = $baseToken;
        $suffix = 1;

        while (Wedding::query()->where('event_token', $token)->exists()) {
            $suffix++;
            $token = "{$baseToken}-{$suffix}";
        }

        return $token;
    }

    private function deleteUser(User $user): RedirectResponse
    {
        DB::transaction(function () use ($user): void {
            if ($user->wedding && !empty($user->wedding->main_image)) {
                $this->deleteMainImagePath($user->wedding->main_image);
            }

            $user->wedding()->delete();
            $user->delete();
        });

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }

    private function storeWeddingMainImage(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $fileName = Str::uuid()->toString() . '.' . $extension;

        return Storage::disk('public')->putFileAs('weddings/main-images', $file, $fileName);
    }

    private function deleteMainImagePath(string $path): void
    {
        $normalizedPath = ltrim($path, '/');

        if (Str::startsWith($normalizedPath, 'weddings/main-images/')) {
            if (Storage::disk('public')->exists($normalizedPath)) {
                Storage::disk('public')->delete($normalizedPath);
            }

            return;
        }

        // Legacy support for files previously stored directly under public/uploads.
        if (Str::startsWith($normalizedPath, 'uploads/')) {
            $legacyPublicPath = public_path($normalizedPath);

            if (is_file($legacyPublicPath)) {
                @unlink($legacyPublicPath);
            }
        }
    }

    private function resolveMainImageUrl(?string $path): ?string
    {
        if (empty($path)) {
            return null;
        }

        $normalizedPath = ltrim($path, '/');

        if (Str::startsWith($normalizedPath, 'weddings/main-images/')) {
            return asset('storage/' . $normalizedPath);
        }

        // Legacy support for older records saved as public/uploads/... paths.
        if (Str::startsWith($normalizedPath, 'uploads/')) {
            return '/' . $normalizedPath;
        }

        return null;
    }
}
