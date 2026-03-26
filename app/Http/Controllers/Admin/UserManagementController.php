<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeClientMail;
use App\Models\EmailLog;
use App\Models\InvitationView;
use App\Models\Rsvp;
use App\Models\TableAssignment;
use App\Models\User;
use App\Models\Wedding;
use App\Models\WeddingType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
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
            ->with('weddingType')
            ->get()
            ->mapWithKeys(fn (Wedding $wedding) => [
                (string) $wedding->user_id => [
                    'id' => (string) $wedding->id,
                    'bride_name' => $wedding->bride_name,
                    'groom_name' => $wedding->groom_name,
                    'wedding_type_id' => (string) ($wedding->wedding_type_id ?? ''),
                    'wedding_type_name' => $wedding->weddingType?->name ?? '',
                    'rsvp_deadline' => $wedding->rsvp_deadline?->toDateString() ?? '',
                    'contact_number_1' => $wedding->contact_number_1,
                    'contact_number_2' => $wedding->contact_number_2,
                    'template_key' => $wedding->template_key,
                    'typography_key' => $wedding->typography_key,
                    'main_image_url' => $this->resolveMainImageUrl($wedding->main_image),
                    'event_token' => $wedding->event_token,
                    'status' => $wedding->status,
                ],
            ]);

        $weddingTypes = WeddingType::orderBy('id')->get()->map(fn (WeddingType $wt) => [
            'id' => (string) $wt->id,
            'name' => $wt->name,
        ])->values();

        return Inertia::render('admin/Users', [
            'users' => $users,
            'weddingsByUserId' => $weddingsByUserId,
            'weddingTypes' => $weddingTypes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password'         => ['required', 'string', 'min:8'],
            'phone'            => ['required', 'string', 'max:10'],
            'status'           => ['required', 'in:active,deactive,expired'],
            'expire_date'      => ['nullable', 'date'],
            'table_management' => ['boolean'],
            'share_memory'     => ['boolean'],
            'image_count'      => ['nullable', 'integer', 'in:0,20,30'],
            'bride_name'       => ['nullable', 'string', 'max:255'],
            'groom_name'       => ['nullable', 'string', 'max:255'],
            'wedding_type_id'  => ['nullable', 'exists:wedding_types,id'],
            'main_image'       => ['nullable', 'image', 'max:15360', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $weddingRequested = !empty($validated['bride_name'])
            || !empty($validated['groom_name'])
            || $request->hasFile('main_image');

        if ($weddingRequested) {
            $request->validate([
                'bride_name' => ['required', 'string', 'max:255'],
                'groom_name' => ['required', 'string', 'max:255'],
            ]);
        }

        DB::transaction(function () use ($validated, $request, $weddingRequested): void {
            $shareMemory = (bool) ($validated['share_memory'] ?? false);
            $user = User::create([
                'name'             => $validated['name'],
                'email'            => $validated['email'],
                'password'         => $validated['password'],
                'phone'            => $validated['phone'],
                'status'           => $validated['status'],
                'expire_date'      => $validated['expire_date'] ?: null,
                'table_management' => (bool) ($validated['table_management'] ?? false),
                'share_memory'     => $shareMemory,
                'image_count'      => $shareMemory ? (int) ($validated['image_count'] ?? 20) : 0,
            ]);

            if ($weddingRequested) {
                $mainImagePath = null;

                if ($request->hasFile('main_image')) {
                    $mainImagePath = $this->storeWeddingMainImage($request->file('main_image'));
                }

                Wedding::create([
                    'user_id'         => $user->id,
                    'event_token'     => $this->buildUniqueEventToken(
                        $validated['bride_name'],
                        $validated['groom_name']
                    ),
                    'bride_name'      => $validated['bride_name'],
                    'groom_name'      => $validated['groom_name'],
                    'wedding_type_id' => $validated['wedding_type_id'] ?: null,
                    'main_image'      => $mainImagePath,
                    'status'          => 'draft',
                ]);
            }

            // Capture user ID for post-transaction email dispatch.
            $newUserId = $user->id;
        });

        // Send welcome email after the transaction completes successfully.
        // Re-fetch with wedding so the email can include couple names if a wedding was created.
        $newUserId = User::where('email', $validated['email'])->value('id');
        if ($newUserId) {
            $createdUser = User::with('wedding')->find($newUserId);
            Mail::to($createdUser->email)
                ->send(new WelcomeClientMail($createdUser, $createdUser->wedding));
            EmailLog::record($newUserId, EmailLog::TYPE_WELCOME);
        }

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'email'            => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password'         => ['nullable', 'string', 'min:8'],
            'phone'            => ['required', 'string', 'max:10'],
            'status'           => ['required', 'in:active,deactive,expired'],
            'expire_date'      => ['nullable', 'date'],
            'table_management' => ['boolean'],
            'share_memory'     => ['boolean'],
            'image_count'      => ['nullable', 'integer', 'in:0,20,30'],
            'bride_name'       => ['nullable', 'string', 'max:255'],
            'groom_name'       => ['nullable', 'string', 'max:255'],
            'wedding_type_id'  => ['nullable', 'exists:wedding_types,id'],
        ]);

        $weddingRequested = !empty($validated['bride_name'])
            || !empty($validated['groom_name'])
            || $user->wedding()->exists();

        if ($weddingRequested) {
            $request->validate([
                'bride_name' => ['required', 'string', 'max:255'],
                'groom_name' => ['required', 'string', 'max:255'],
            ]);
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
                    'bride_name'      => $validated['bride_name'] ?? '',
                    'groom_name'      => $validated['groom_name'] ?? '',
                    'wedding_type_id' => $validated['wedding_type_id'] ?: null,
                    'status'          => $wedding?->status ?? 'draft',
                ];

                if ($wedding) {
                    $wedding->update($weddingPayload);
                } else {
                    Wedding::create([
                        ...$weddingPayload,
                        'user_id'     => $user->id,
                        'event_token' => $this->buildUniqueEventToken(
                            $validated['bride_name'] ?? 'bride',
                            $validated['groom_name'] ?? 'groom'
                        ),
                    ]);
                }
            }
        });

        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    public function toggleStatus(User $user): RedirectResponse
    {
        $user->status = $user->status === 'active' ? 'deactive' : 'active';
        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'User status updated.');
    }

    public function destroy(User $user): RedirectResponse
    {
        return $this->deleteUser($user);
    }

    private function buildUniqueEventToken(string $brideName, string $groomName): string
    {
        $year = date('Y');
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
            $wedding = $user->wedding;

            if ($wedding) {
                // Delete main image file
                if (!empty($wedding->main_image)) {
                    $this->deleteMainImagePath($wedding->main_image);
                }

                // Delete memory files
                foreach ($wedding->memories as $memory) {
                    Storage::disk('public')->delete($memory->image_path);
                }

                // Delete gallery image files
                foreach ($wedding->galleryImages as $img) {
                    if (Storage::disk('public')->exists($img->image_path)) {
                        Storage::disk('public')->delete($img->image_path);
                    }
                }

                // Delete dependent DB records in FK-safe order
                Rsvp::where('wedding_id', $wedding->id)->delete();
                InvitationView::where('wedding_id', $wedding->id)->delete();
                TableAssignment::where('wedding_id', $wedding->id)->delete();
                $wedding->memories()->delete();
                $wedding->guests()->delete();
                $wedding->galleryImages()->delete();
                $wedding->tables()->delete();

                // Delete wedding-type-specific detail records
                $wedding->sinhalaDetails()->delete();
                $wedding->christianDetails()->delete();
                $wedding->tamilDetails()->delete();
                $wedding->muslimDetails()->delete();

                $wedding->delete();
            }

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
