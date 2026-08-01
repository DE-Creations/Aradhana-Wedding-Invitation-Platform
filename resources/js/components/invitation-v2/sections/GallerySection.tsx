import { GalleryCarousel } from '@/components/invitation/GalleryCarousel';
import { OrnamentalDivider } from '../components/Ornaments';

export default function GallerySection({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="section-full bg-wine" style={{ textAlign: 'center' }}>
      <h2 className="font-serif-display" style={{ color: '#C9A96E', fontStyle: 'italic', fontSize: 'clamp(1.75rem, 5vw, 2.25rem)' }}>
        Our Moments
      </h2>
      <p className="font-body" style={{ color: '#E8D5A3', fontSize: '1.05rem' }}>
        A glimpse into our journey together
      </p>
      <OrnamentalDivider />

      <div style={{ width: '100%', maxWidth: 560, marginTop: '1rem' }}>
        <GalleryCarousel
          images={photos}
          stageClassName="rounded-xl border border-[#C9A96E]"
          arrowClassName="gallery-arrow"
          dotActiveClassName="w-6 bg-[#C9A96E]"
          dotClassName="w-2.5 bg-[rgba(201,169,110,0.35)]"
        />
      </div>
    </section>
  );
}
