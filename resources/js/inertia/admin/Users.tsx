import { usePage } from '@inertiajs/react';
import AdminShell from '@/inertia/layouts/AdminShell';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';

type WeddingSummary = {
	id: string;
	bride_name: string;
	groom_name: string;
	wedding_type_id: string;
	wedding_type_name: string;
	event_token: string;
	status: string;
};

type UserListItem = {
	id: string;
	name: string;
	email: string;
	phone: string;
	status: 'active' | 'deactive' | 'expired';
	expire_date: string;
	created_at: string;
	updated_at: string;
	table_management: boolean;
	share_memory: boolean;
	image_count: number;
};

type WeddingType = {
	id: string;
	name: string;
};

type UsersPageProps = {
	users: UserListItem[];
	weddingsByUserId: Record<string, WeddingSummary>;
	weddingTypes: WeddingType[];
};

export default function Users() {
	const { users = [], weddingsByUserId = {}, weddingTypes = [] } = usePage<UsersPageProps>().props;

	return (
		<AdminShell currentPage="admin-users">
			<AdminUsersPage users={users} weddingsByUserId={weddingsByUserId} weddingTypes={weddingTypes} />
		</AdminShell>
	);
}
