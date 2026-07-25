import Lenis from '@studio-freight/lenis'
import { useEffect } from 'react'

/**
 * Initialise Lenis smooth scrolling for the page.
 * Respects the user's reduced-motion preference (skips smoothing).
 *
 * @param {boolean} enabled  when false, smooth scroll is not initialised
 */
export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [enabled])
}
