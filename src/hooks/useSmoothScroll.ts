import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/gsap';
import { prefersReducedMotion, setLenis } from '../lib/scroll';

/**
 * Lenis is enabled on desktop only. Touch devices keep native scrolling,
 * which is faster and avoids fighting the browser's momentum model.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const raf = (time: number) => {
      lenis?.raf(time * 1000);
    };

    const destroy = () => {
      if (!lenis) return;
      gsap.ticker.remove(raf);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      lenis = null;
      setLenis(null);
    };

    const create = () => {
      if (lenis || !desktop.matches || reduced.matches || prefersReducedMotion()) return;

      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        smoothWheel: true,
        syncTouch: false,
      });

      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      if (document.documentElement.classList.contains('is-locked')) {
        lenis.stop();
      }

      ScrollTrigger.refresh();
    };

    const sync = () => {
      if (desktop.matches && !reduced.matches) create();
      else destroy();
    };

    sync();
    desktop.addEventListener('change', sync);
    reduced.addEventListener('change', sync);

    return () => {
      desktop.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
      destroy();
    };
  }, []);
}
