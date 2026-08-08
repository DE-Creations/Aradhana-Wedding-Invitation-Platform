import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import { EnvelopeReveal } from '@/components/invitation/EnvelopeReveal';
import { FloatingPetals } from '@/components/invitation/FloatingPetals';
import { MusicControl } from '@/components/invitation/MusicControl';
import { useSmoothScroll } from '@/components/invitation/hooks/useSmoothScroll';

import ScrollProgress from './components/ScrollProgress';
import SafeBoundary from './components/SafeBoundary';

import HeroSection from './sections/HeroSection';
import GuestGreeting from './sections/GuestGreeting';
import ParentsSection from './sections/ParentsSection';
import CountdownSection from './sections/CountdownSection';
import CeremonyDetails from './sections/CeremonyDetails';
import GallerySection from './sections/GallerySection';
import RsvpSectionWrapper from './sections/RsvpSectionWrapper';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';

import { buildInvitationViewModel, type InvitationViewModelProps } from './viewModel';

import './invitation-v2.css';

export default function WeddingInvitation(props: InvitationViewModelProps) {
  const invitation = buildInvitationViewModel(props);
  const { guest, eventToken } = props;

  const revealStorageKey = `aradhana-invite-opened:${eventToken ?? 'preview'}`;
  const [revealed, setRevealed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(revealStorageKey) === '1';
    } catch {
      return false;
    }
  });
  const handleReveal = () => {
    try {
      sessionStorage.setItem(revealStorageKey, '1');
    } catch {
      /* ignore storage errors (private mode) */
    }
    setRevealed(true);
  };

  useSmoothScroll(revealed);

  useEffect(() => {
    document.body.style.overflow = revealed ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [revealed]);

  useEffect(() => {
    document.title = `${invitation.groom_name} & ${invitation.bride_name} · Wedding`;
  }, [invitation.groom_name, invitation.bride_name]);

  return (
    <div className="inv2-root grain-overlay" style={{ position: 'relative' }}>
      <AnimatePresence>
        {!revealed && (
          <EnvelopeReveal
            key="envelope"
            groomName={invitation.groom_name}
            brideName={invitation.bride_name}
            onReveal={handleReveal}
          />
        )}
      </AnimatePresence>

      {revealed && (
        <>
          <SafeBoundary>
            <FloatingPetals />
          </SafeBoundary>
          <ScrollProgress />
          {invitation.music_url && <MusicControl src={invitation.music_url} autoPlay />}
        </>
      )}

      <main style={{ position: 'relative', zIndex: 3 }}>
        <HeroSection invitation={invitation} />
        <GuestGreeting guestName={guest?.guest_name} />
        <ParentsSection invitation={invitation} />
        <CountdownSection invitation={invitation} />
        <CeremonyDetails events={invitation.ceremony_events} />
        <GallerySection photos={invitation.gallery_photos.map((p) => p.photo_path)} />
        <RsvpSectionWrapper invitation={invitation} guest={guest} eventToken={eventToken} />
        <ContactSection invitation={invitation} />
        <FooterSection invitation={invitation} />
      </main>
    </div>
  );
}
