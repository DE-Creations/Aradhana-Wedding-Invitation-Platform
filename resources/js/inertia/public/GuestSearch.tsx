import { usePage } from '@inertiajs/react';
import { QRGuestSearchPage } from '@/pages/public/QRGuestSearchPage';

export default function GuestSearch() {
  const { wedding, guests, token, tableManagement, shareMemory, imageCount } = usePage<{
    wedding: any;
    guests: any[];
    token: string;
    tableManagement: boolean;
    shareMemory: boolean;
    imageCount: number;
  }>().props;
  return (
    <QRGuestSearchPage
      wedding={wedding}
      guests={guests ?? []}
      token={token ?? ''}
      tableManagement={tableManagement}
      shareMemory={shareMemory}
      imageCount={imageCount}
    />
  );
}
