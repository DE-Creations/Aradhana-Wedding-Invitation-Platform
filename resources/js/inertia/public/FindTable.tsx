import { usePage } from '@inertiajs/react';
import { FindTablePage } from '@/pages/public/FindTablePage';

export default function FindTable() {
  const { wedding, token, tableManagement } = usePage<{
    wedding: any;
    token: string;
    tableManagement: boolean;
  }>().props;

  return (
    <FindTablePage
      wedding={wedding}
      token={token ?? ''}
      tableManagement={tableManagement}
    />
  );
}
