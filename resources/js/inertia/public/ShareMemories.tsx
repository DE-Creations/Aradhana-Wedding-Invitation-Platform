import { usePage } from '@inertiajs/react';
import { ShareMemoriesPage } from '@/pages/public/ShareMemoriesPage';

export default function ShareMemories() {
  const { wedding, token, shareMemory, imageCount } = usePage<{
    wedding: any;
    token: string;
    shareMemory: boolean;
    imageCount: number;
  }>().props;

  return (
    <ShareMemoriesPage
      wedding={wedding}
      token={token ?? ''}
      shareMemory={shareMemory}
      imageCount={imageCount}
    />
  );
}
