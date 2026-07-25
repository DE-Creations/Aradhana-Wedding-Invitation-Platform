<?php

namespace App\Filament\User\Resources\Invitations\Schemas;

use App\Filament\Shared\InvitationFormSchema;
use Filament\Schemas\Schema;

class InvitationForm
{
    public static function configure(Schema $schema): Schema
    {
        // Status is controlled via Publish/Unpublish actions; ownership is
        // assigned automatically from the authenticated user.
        return $schema->components(InvitationFormSchema::components());
    }
}
