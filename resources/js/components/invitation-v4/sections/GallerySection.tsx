import { Reveal } from "@/components/invitation/Reveal";
import { GalleryCarousel } from "@/components/invitation/GalleryCarousel";
import { Divider } from "../components/Divider";

export default function GallerySection({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="inv4-section">
      <Reveal animation="fadeUp" className="inv4-inner">
        <p className="inv4-eyebrow font-t-body">Our Moments</p>
        <h2 className="inv4-title font-t-heading">A Glimpse of Our Journey</h2>
        <Divider />
        <div className="mx-auto mt-5 w-full max-w-xl">
          <GalleryCarousel
            images={photos}
            stageClassName="rounded-2xl border border-white shadow-[0_10px_34px_rgba(60,80,120,0.18)]"
            arrowClassName="inv4-gallery-arrow"
            dotActiveClassName="w-6 bg-[#1c2a44]"
            dotClassName="w-2.5 bg-[#c9d3e3]"
          />
        </div>
      </Reveal>
    </section>
  );
}
