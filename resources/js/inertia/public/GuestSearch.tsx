import { usePage } from '@inertiajs/react';
import { QRGuestSearchPage } from '@/pages/public/QRGuestSearchPage';

export default function GuestSearch() {
  const { wedding, guests, token } = usePage<{ wedding: any; guests: any[]; token: string }>().props;
  return <QRGuestSearchPage wedding={wedding} guests={guests ?? []} token={token ?? ''} />;
}
