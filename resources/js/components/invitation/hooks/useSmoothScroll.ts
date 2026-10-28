import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

/** The Lenis instance currently driving the page, if any (used by scrollToSection). */
let activeLenis: Lenis | null = null;

/**
 * Enables Lenis momentum smooth-scrolling while mounted.
 * Skips entirely when the user prefers reduced motion or when disabled.
 */
export function useSmoothScroll(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    activeLenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      if (activeLenis === lenis) activeLenis = null;
    };
  }, [enabled]);
}

/**
 * Smoothly scrolls the element with the given id to the middle of the viewport
 * (or to its top when it is taller than the viewport). Uses Lenis when it is
 * running so the two scroll systems do not fight, otherwise native smooth scroll.
 */
export function scrollToSection(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const spare = window.innerHeight - el.getBoundingClientRect().height;

  if (activeLenis) {
    activeLenis.scrollTo(el, { offset: spare > 0 ? -spare / 2 : -16, duration: reduced ? 0 : 1.2 });
    return;
  }
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: spare > 0 ? "center" : "start" });
}

/** Smoothly scrolls back to the top of the page (Lenis when running, native otherwise). */
export function scrollToTop() {
  if (typeof window === "undefined") return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (activeLenis) {
    activeLenis.scrollTo(0, { duration: reduced ? 0 : 1.2 });
    return;
  }
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

export default useSmoothScroll;
