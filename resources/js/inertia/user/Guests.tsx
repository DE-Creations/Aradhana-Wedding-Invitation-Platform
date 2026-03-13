import { usePage } from '@inertiajs/react';
import UserShell from '@/inertia/layouts/UserShell';
import { GuestManagementPage } from '@/pages/user/GuestManagementPage';

export default function Guests() {
  const { guests, tables, event_token } = usePage<{
    guests: Array<{ id: string; guest_name: string; phone: string; max_attendees: number; rsvp_status: string; attending_count: number; invitation_opened_at: string | null; rsvp_clicked_at: string | null; responded_at: string | null; table_id: string | null; table_name: string | null; guest_token: string }>;
    tables: Array<{ id: string; table_name: string }>;
    event_token: string;
  }>().props;

  return (
    <UserShell currentPage="guests">
      <GuestManagementPage guests={guests} tables={tables} event_token={event_token} />
    </UserShell>
  );
}
