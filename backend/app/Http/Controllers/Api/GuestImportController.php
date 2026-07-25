<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImportGuestsRequest;
use App\Models\Invitation;
use App\Support\GuestCsvImporter;
use Illuminate\Http\JsonResponse;

class GuestImportController extends Controller
{
    /**
     * POST /api/user/invitations/{invitation}/guests/import
     *
     * Accepts a CSV file with header columns: name, email, phone.
     */
    public function store(ImportGuestsRequest $request, Invitation $invitation): JsonResponse
    {
        $this->authorize('update', $invitation);

        $result = GuestCsvImporter::import($invitation, $request->file('file')->getRealPath());

        return response()->json([
            'message' => "Imported {$result['imported']} guest(s).",
            'imported' => $result['imported'],
            'skipped' => $result['skipped'],
        ], 201);
    }
}
