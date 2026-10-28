import { YourTableSection } from '@/components/invitation/YourTableSection';
import type { TableInfo } from '@/components/invitation/animated/types';

/** "Your Table" for Gilded Rose: shown below Ceremony Details when the client has Table Management. */
export default function TableSection({ tableInfo }: { tableInfo?: TableInfo | null }) {
  return (
    <YourTableSection
      tableInfo={tableInfo}
      sectionClassName="section-pad bg-radial-wine"
      sectionStyle={{ textAlign: 'center' }}
      eyebrowClassName="label-caps"
      headingFontClassName="font-serif-display"
      headingToneClassName="text-[#FAF7F2]"
      cardClassName="glass-card"
      textClassName="font-body text-[#FAF7F2]"
      subTextClassName="font-body text-[#E8D5A3]"
      accentClassName="text-[#C9A96E]"
    />
  );
}
