import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { useInvitationData } from './hooks/useInvitationData'
import { useSmoothScroll } from './hooks/useSmoothScroll'

import EnvelopeReveal from './sections/EnvelopeReveal'
import HeroSection from './sections/HeroSection'
import GuestGreeting from './sections/GuestGreeting'
import ParentsSection from './sections/ParentsSection'
import CountdownSection from './sections/CountdownSection'
import CeremonyDetails from './sections/CeremonyDetails'
import GallerySection from './sections/GallerySection'
import RsvpSection from './sections/RsvpSection'
import ContactSection from './sections/ContactSection'
import FooterSection from './sections/FooterSection'

import MusicToggle from './components/MusicToggle'
import ScrollProgress from './components/ScrollProgress'
import SafeBoundary from './components/SafeBoundary'

// Petals (tsparticles) are code-split so the engine stays out of the main bundle.
const FloatingPetals = lazy(() => import('./components/FloatingPetals'))

function CenteredMessage({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#C9A96E',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.25rem',
        letterSpacing: '0.1em',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Main wedding template wrapper.
 *
 * @param {string} slug   invitation slug (from the route)
 * @param {string} [token] optional guest token (from the route)
 */
export default function WeddingInvitation({ slug, token }) {
  const { invitation, guest, loading, error } = useInvitationData(slug, token)
  const [revealed, setRevealed] = useState(false)

  // Smooth scroll starts only once content is revealed.
  useSmoothScroll(revealed)

  // Lock scroll while the envelope overlay is showing.
  useEffect(() => {
    document.body.style.overflow = revealed ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [revealed])

  // Set page title once data loads.
  useEffect(() => {
    if (invitation) {
      document.title = `${invitation.groom_name} & ${invitation.bride_name} · Wedding`
    }
  }, [invitation])

  if (loading) return <CenteredMessage>Preparing your invitation…</CenteredMessage>
  if (error || !invitation)
    return <CenteredMessage>This invitation could not be found.</CenteredMessage>

  return (
    <div className="grain-overlay" style={{ position: 'relative' }}>
      <AnimatePresence>
        {!revealed && (
          <EnvelopeReveal
            key="envelope"
            groomName={invitation.groom_name}
            brideName={invitation.bride_name}
            onReveal={() => setRevealed(true)}
          />
        )}
      </AnimatePresence>

      {revealed && (
        <>
          <SafeBoundary>
            <Suspense fallback={null}>
              <FloatingPetals colors={invitation.colors} />
            </Suspense>
          </SafeBoundary>
          <ScrollProgress />
          <MusicToggle src={invitation.music_url} autoStart />
        </>
      )}

      <main style={{ position: 'relative', zIndex: 3 }}>
        <HeroSection invitation={invitation} />
        <GuestGreeting guestName={guest?.name} message={invitation.message} />
        <ParentsSection invitation={invitation} />
        <CountdownSection invitation={invitation} />
        <CeremonyDetails invitation={invitation} />
        <GallerySection photos={invitation.gallery_photos} />
        <RsvpSection invitation={invitation} guest={guest} />
        <ContactSection invitation={invitation} />
        <FooterSection invitation={invitation} />
      </main>
    </div>
  )
}
