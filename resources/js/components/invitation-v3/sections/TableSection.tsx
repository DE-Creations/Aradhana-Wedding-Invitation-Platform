import { YourTableSection } from "@/components/invitation/YourTableSection";
import type { TableInfo } from "@/components/invitation/animated/types";

/** "Your Table" for Crimson Unveil: below Ceremony Details when the client has Table Management. */
export default function TableSection({ tableInfo }: { tableInfo?: TableInfo | null }) {
  return (
    <YourTableSection
      tableInfo={tableInfo}
      sectionClassName="inv3-section"
      eyebrowClassName="inv3-gold font-t-body"
      headingFontClassName="font-t-heading"
      headingToneClassName="text-[#F5E6C8]"
      cardClassName="inv3-card"
      textClassName="inv3-text font-t-body"
      subTextClassName="inv3-text-soft font-t-body"
      accentClassName="text-[#C9A227]"
    />
  );
}
