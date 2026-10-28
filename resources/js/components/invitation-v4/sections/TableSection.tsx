import { YourTableSection } from "@/components/invitation/YourTableSection";
import type { TableInfo } from "@/components/invitation/animated/types";

/** "Your Table" for Silver Pearl: right below Ceremony Details, only with Table Management. */
export default function TableSection({ tableInfo }: { tableInfo?: TableInfo | null }) {
  return (
    <YourTableSection
      tableInfo={tableInfo}
      sectionClassName="inv4-section pt-0"
      eyebrowClassName="inv4-eyebrow font-t-body"
      headingFontClassName="font-t-heading"
      headingToneClassName="text-[#1c2a44]"
      cardClassName="inv4-glass"
      textClassName="inv4-text font-t-body"
      subTextClassName="inv4-text-soft font-t-body"
      accentClassName="text-[#5b7aa6]"
    />
  );
}
