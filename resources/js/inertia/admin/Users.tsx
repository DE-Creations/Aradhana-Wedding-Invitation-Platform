import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import AdminShell from '@/inertia/layouts/AdminShell';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';

type WeddingSummary = {
	id: string;
	bride_name: string;
	groom_name: string;
	bride_parents_names?: string | null;
	groom_parents_names?: string | null;
	event_date: string;
	start_time?: string | null;
	end_time?: string | null;
	poruwa_time?: string | null;
	venue_name?: string | null;
	venue_address?: string | null;
	google_maps_link?: string | null;
	rsvp_deadline?: string | null;
	contact_number_1?: string | null;
	contact_number_2?: string | null;
	template_key?: string | null;
	typography_key?: string | null;
	main_image?: string | null;
	event_token: string;
};

type UserListItem = {
	id: string;
	name: string;
	email: string;
	phone: string;
	status: 'active' | 'inactive' | 'expired';
	expire_date: string;
	created_at: string;
	updated_at: string;
};

type UsersPageProps = PageProps<{
	users: UserListItem[];
	weddingsByUserId: Record<string, WeddingSummary>;
}>;

export default function Users() {
	const { users = [], weddingsByUserId = {} } = usePage<UsersPageProps>().props;

	return (
		<AdminShell currentPage="admin-users">
			<AdminUsersPage users={users} weddingsByUserId={weddingsByUserId} />
		</AdminShell>
	);
}
