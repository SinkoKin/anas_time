import { useEffect } from 'react';
import { ScrollTrigger } from '../lib/gsap';

/** Refresh trigger positions once fonts and images have settled. */
export function useScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const onLoad = () => window.setTimeout(refresh, 120);

    window.addEventListener('load', onLoad);
    document.fonts?.ready.then(() => window.setTimeout(refresh, 60));

    const timeout = window.setTimeout(refresh, 1200);

    return () => {
      window.removeEventListener('load', onLoad);
      window.clearTimeout(timeout);
    };
  }, []);
}
