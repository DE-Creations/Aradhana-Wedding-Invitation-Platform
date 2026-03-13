<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Memory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use ZipArchive;

class MemoryController extends Controller
{
    public function index(): Response
    {
        $wedding = Auth::user()->wedding;

        if (! $wedding) {
            return Inertia::render('user/Memories', ['memories' => []]);
        }

        $memories = $wedding->memories()
            ->with('guest:id,guest_name')
            ->orderByDesc('uploaded_at')
            ->get()
            ->map(fn ($m) => [
                'id'          => $m->id,
                'guest_id'    => $m->guest_id,
                'guest_name'  => $m->guest?->guest_name ?? 'Guest',
                'image_path'  => asset('storage/' . $m->image_path),
                'file_name'   => $m->file_name,
                'file_size'   => $m->file_size,
                'mime_type'   => $m->mime_type,
                'status'      => $m->status,
                'uploaded_at' => $m->uploaded_at?->toDateTimeString(),
            ]);

        return Inertia::render('user/Memories', [
            'memories' => $memories,
        ]);
    }

    public function approve(Memory $memory): RedirectResponse
    {
        $this->authorizeMemory($memory);

        $memory->update(['status' => 'approved']);

        return back()->with('success', 'Memory approved.');
    }

    public function reject(Memory $memory): RedirectResponse
    {
        $this->authorizeMemory($memory);

        $memory->update(['status' => 'rejected']);

        return back()->with('success', 'Memory rejected.');
    }

    public function batchUpdate(Request $request): RedirectResponse
    {
        $request->validate([
            'ids'    => ['required', 'array'],
            'ids.*'  => ['integer'],
            'status' => ['required', 'in:approved,rejected'],
        ]);

        $wedding = Auth::user()->wedding;

        if (! $wedding) {
            return back()->withErrors(['wedding' => 'No wedding found.']);
        }

        Memory::whereIn('id', $request->ids)
              ->where('wedding_id', $wedding->id)
              ->update(['status' => $request->status]);

        return back()->with('success', 'Memories updated.');
    }

    public function downloadAll(): StreamedResponse
    {
        $wedding = Auth::user()->wedding;

        abort_if(! $wedding, 403);

        $memories = Memory::where('wedding_id', $wedding->id)
            ->where('status', 'approved')
            ->with('guest:id,guest_name')
            ->get();

        abort_if($memories->isEmpty(), 404, 'No approved memories to download.');

        $zipPath = tempnam(sys_get_temp_dir(), 'memories_') . '.zip';
        $zip     = new ZipArchive();
        $zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE);

        $nameCounts = [];

        foreach ($memories as $memory) {
            $fullPath = Storage::disk('public')->path($memory->image_path);

            if (! file_exists($fullPath)) {
                continue;
            }

            // Organise into sub-folders by guest name
            $guestFolder = preg_replace('/[\/:*?"<>|\\\\]/', '_', $memory->guest?->guest_name ?? 'Unknown');
            $baseName    = $memory->file_name ?: basename($memory->image_path);

            // Deduplicate filenames within the same sub-folder
            $key = $guestFolder . '/' . $baseName;
            if (isset($nameCounts[$key])) {
                $nameCounts[$key]++;
                $info     = pathinfo($baseName);
                $baseName = ($info['filename'] ?? 'file') . '_' . $nameCounts[$key] . '.' . ($info['extension'] ?? 'jpg');
            } else {
                $nameCounts[$key] = 1;
            }

            $zip->addFile($fullPath, $guestFolder . '/' . $baseName);
        }

        $zip->close();

        $safeName = preg_replace('/[^a-z0-9_\-]/i', '_', $wedding->bride_name . '_' . $wedding->groom_name);
        $fileName = 'memories_' . $safeName . '_' . date('Ymd') . '.zip';

        return response()->streamDownload(function () use ($zipPath) {
            readfile($zipPath);
            @unlink($zipPath);
        }, $fileName, [
            'Content-Type'        => 'application/zip',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }

    public function destroy(Memory $memory): RedirectResponse
    {
        $this->authorizeMemory($memory);

        Storage::disk('public')->delete($memory->image_path);
        $memory->delete();

        return back()->with('success', 'Memory deleted.');
    }

    private function authorizeMemory(Memory $memory): void
    {
        $wedding = Auth::user()->wedding;
        abort_if(! $wedding || $memory->wedding_id !== $wedding->id, 403);
    }
}
