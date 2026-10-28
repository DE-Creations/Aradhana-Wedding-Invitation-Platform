import { Reveal } from "@/components/invitation/Reveal";
import { GalleryCarousel } from "@/components/invitation/GalleryCarousel";
import { Ornament } from "../components/Ornament";

export default function GallerySection({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="inv3-section">
      <Reveal animation="fadeUp" className="inv3-inner">
        <p className="inv3-eyebrow font-t-body">Our Moments</p>
        <h2 className="inv3-title font-t-heading">A Glimpse of Our Journey</h2>
        <Ornament />
        <div className="mx-auto mt-6 w-full max-w-xl">
          <GalleryCarousel
            images={photos}
            stageClassName="rounded-2xl border border-[rgba(201,162,39,0.55)]"
            arrowClassName="inv3-gallery-arrow"
            dotActiveClassName="w-6 bg-[#C9A227]"
            dotClassName="w-2.5 bg-[rgba(201,162,39,0.35)]"
          />
        </div>
      </Reveal>
    </section>
  );
}
