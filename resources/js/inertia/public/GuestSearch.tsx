import { usePage } from '@inertiajs/react';
import { QRGuestSearchPage } from '@/pages/public/QRGuestSearchPage';

export default function GuestSearch() {
  const { wedding, token, tableManagement, shareMemory } = usePage<{
    wedding: any;
    token: string;
    tableManagement: boolean;
    shareMemory: boolean;
  }>().props;

  return (
    <QRGuestSearchPage
      wedding={wedding}
      token={token ?? ''}
      tableManagement={tableManagement}
      shareMemory={shareMemory}
    />
  );
}

