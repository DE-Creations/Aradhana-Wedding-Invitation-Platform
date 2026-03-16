import { usePage } from '@inertiajs/react';
import UserShell from '@/inertia/layouts/UserShell';
import { WeddingSettingsPage } from '@/pages/user/WeddingSettingsPage';

type WeddingData = {
	id: string;
	bride_name: string;
	groom_name: string;
	bride_parents_names: string;
	groom_parents_names: string;
	wedding_type_id: string;
	wedding_type_name: string;
	rsvp_deadline: string;
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

type SettingsPageProps = {
	wedding: WeddingData | null;
	galleryImages: GalleryImage[];
	eventDetails: Record<string, string | boolean> | null;
	[key: string]: unknown;
};

export default function Settings() {
	const { wedding, galleryImages, eventDetails } = usePage<SettingsPageProps>().props;

	return (
		<UserShell currentPage="setup">
			<WeddingSettingsPage
				wedding={wedding}
				galleryImages={galleryImages}
				eventDetails={eventDetails ?? null}
			/>
		</UserShell>
	);
}
