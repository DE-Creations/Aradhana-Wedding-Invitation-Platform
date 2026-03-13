import { usePage } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import UserShell from '@/inertia/layouts/UserShell';
import { WeddingSettingsPage } from '@/pages/user/WeddingSettingsPage';

type WeddingData = {
	id: string;
	bride_name: string;
	groom_name: string;
	bride_parents_names: string;
	groom_parents_names: string;
	event_date: string;
	rsvp_deadline: string;
	start_time: string;
	end_time: string;
	poruwa_time: string;
	venue_name: string;
	venue_address: string;
	google_maps_link: string;
	contact_number_1: string;
	contact_number_2: string;
	template_key: string;
	typography_key: string;
	status: 'draft' | 'active' | 'completed';
	main_image_url: string | null;
};

type GalleryImage = {
	id: string;
	image_url: string;
	sort_order: number;
};

type SettingsPageProps = PageProps<{
	wedding: WeddingData | null;
	galleryImages: GalleryImage[];
}>;

export default function Settings() {
	const { wedding, galleryImages } = usePage<SettingsPageProps>().props;

	return (
		<UserShell currentPage="settings">
			<WeddingSettingsPage wedding={wedding} galleryImages={galleryImages} />
		</UserShell>
	);
}
