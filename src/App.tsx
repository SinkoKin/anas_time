import { useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from './lib/gsap';
import { prefersReducedMotion, scrollToTarget } from './lib/scroll';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { useScrollRefresh } from './hooks/useScrollRefresh';
import type { IntroPhase } from './lib/intro';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { About } from './components/About';
import { Coaching } from './components/Coaching';
import { Process } from './components/Process';
import { Philosophy } from './components/Philosophy';
import { Gallery } from './components/Gallery';
import { InstagramSection } from './components/InstagramSection';
import { Apply } from './components/Apply';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { PageRail } from './components/PageRail';

export default function App() {
  const [intro, setIntro] = useState<IntroPhase>(() =>
    prefersReducedMotion() ? 'done' : 'loading',
  );
  const introDone = intro === 'done';

  useSmoothScroll();
  useScrollRefresh();

  useGSAP(() => {
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) return;

    const revealItems = gsap.utils.toArray<HTMLElement>('[data-reveal]');
    const imageItems = gsap.utils.toArray<HTMLElement>('[data-reveal-image] .media');

    gsap.set(revealItems, { y: 26, opacity: 0 });
    gsap.set(imageItems, { clipPath: 'inset(0 0 100% 0)' });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        const targets = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target);

        targets.forEach((target) => observer.unobserve(target));

        if (targets.length) {
          gsap.to(targets, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.08,
            ease: 'power3.out',
            overwrite: true,
          });
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    );

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        const targets = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target);

        targets.forEach((target) => observer.unobserve(target));

        if (targets.length) {
          gsap.to(targets, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.25,
            stagger: 0.1,
            ease: 'power4.inOut',
            overwrite: true,
          });
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    imageItems.forEach((item) => imageObserver.observe(item));

    return () => {
      revealObserver.disconnect();
      imageObserver.disconnect();
      gsap.set([...revealItems, ...imageItems], {
        clearProps: 'transform,opacity,clipPath',
      });
    };
  }, []);

  useEffect(() => {
    if (!introDone) return;

    const frame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();

      const hash = window.location.hash;
      if (hash && hash !== '#top') {
        const target = document.getElementById(hash.replace('#', ''));
        if (target) scrollToTarget(target, -78);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [introDone]);

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) ScrollTrigger.refresh();
    };

    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  return (
    <>
      <div
        className="site"
        data-intro={intro}
        inert={!introDone}
        aria-busy={!introDone}
      >
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="grain" aria-hidden="true" />

        <Navbar />

        <main id="main" tabIndex={-1}>
          <Hero active={intro !== 'loading'} complete={intro === 'done'} />
          <Ticker />
          <About />
          <Coaching />
          <Process />
          <Philosophy />
          <Gallery />
          <InstagramSection />
          <Apply />
          <Contact />
        </main>

        <Footer />
        <PageRail />
      </div>

      {!introDone && (
        <Preloader
          onReveal={() => setIntro('revealing')}
          onDone={() => setIntro('done')}
        />
      )}
    </>
  );
}
