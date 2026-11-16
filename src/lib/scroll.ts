import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function lockScroll() {
  document.documentElement.classList.add('is-locked');
  lenisInstance?.stop();
}

export function unlockScroll() {
  document.documentElement.classList.remove('is-locked');
  lenisInstance?.start();
}

export function scrollToTarget(target: string | HTMLElement, offset = -78) {
  const element =
    typeof target === 'string' ? document.getElementById(target.replace('#', '')) : target;

  if (!element) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.start();
    lenis.scrollTo(element, {
      offset,
      duration: prefersReducedMotion() ? 0 : 1.15,
    });
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  });
}
