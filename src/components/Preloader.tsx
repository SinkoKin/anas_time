import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { lockScroll, prefersReducedMotion, unlockScroll } from '../lib/scroll';
import './Preloader.css';

type PreloaderProps = {
  onReveal: () => void;
  onDone: () => void;
};

const MIN_LOAD_TIME = 1000;
const MAX_LOAD_TIME = 6000;

export function Preloader({ onReveal, onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        onReveal();
        onDone();
        return;
      }

      const root = rootRef.current;
      if (!root) return;

      let cancelled = false;
      let exitTimeline: gsap.core.Timeline | null = null;
      let completionTween: gsap.core.Tween | null = null;
      const timers = new Set<number>();
      const start = performance.now();
      const state = { value: 0 };
      let lastValue = -1;

      const wait = (ms: number) =>
        new Promise<void>((resolve) => {
          const id = window.setTimeout(() => {
            timers.delete(id);
            resolve();
          }, ms);
          timers.add(id);
        });

      const paint = () => {
        const value = Math.min(100, Math.max(0, state.value));
        const rounded = Math.round(value);

        if (rounded !== lastValue) {
          lastValue = rounded;
          if (countRef.current) {
            countRef.current.textContent = String(rounded).padStart(3, '0');
          }
          if (progressRef.current) {
            progressRef.current.setAttribute('aria-valuenow', String(rounded));
            progressRef.current.setAttribute('aria-valuetext', `${rounded} percent prepared`);
          }
        }

        if (fillRef.current) {
          fillRef.current.style.transform = `scaleX(${value / 100})`;
        }
      };

      lockScroll();
      paint();

      const progressTween = gsap.to(state, {
        value: 88,
        duration: 1.05,
        ease: 'power2.out',
        onUpdate: paint,
      });

      const fontsTask = document.fonts
        ? Promise.allSettled([
            document.fonts.load('400 1em "Bebas Neue"'),
            document.fonts.load('400 1em "Manrope"'),
            document.fonts.load('500 1em "Manrope"'),
            document.fonts.load('400 1em "Space Grotesk"'),
            document.fonts.load('500 1em "Space Grotesk"'),
          ]).then(() => document.fonts.ready)
        : Promise.resolve();

      const heroTask = (async () => {
        const image = root.ownerDocument.querySelector<HTMLImageElement>('.hero__photo img');
        if (!image) return;

        if (!image.complete) {
          await new Promise<void>((resolve) => {
            const finish = () => {
              image.removeEventListener('load', finish);
              image.removeEventListener('error', finish);
              resolve();
            };
            image.addEventListener('load', finish, { once: true });
            image.addEventListener('error', finish, { once: true });
          });
        }

        try {
          await image.decode();
        } catch {
          // Decode is best-effort; the image may already be paintable.
        }
      })();

      const loadController = new AbortController();
      const pageLoadTask =
        document.readyState === 'complete'
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              window.addEventListener('load', () => resolve(), {
                once: true,
                signal: loadController.signal,
              });
            });

      const readyTask = Promise.allSettled([fontsTask, heroTask, pageLoadTask]);

      const finish = async () => {
        const elapsed = performance.now() - start;
        if (elapsed < MIN_LOAD_TIME) await wait(MIN_LOAD_TIME - elapsed);
        if (cancelled) return;

        await new Promise<void>((resolve) => {
          let settled = false;
          let fallbackTimer = 0;
          const complete = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(fallbackTimer);
            timers.delete(fallbackTimer);
            resolve();
          };

          completionTween = gsap.to(state, {
            value: 100,
            duration: 0.4,
            ease: 'power2.inOut',
            overwrite: true,
            onUpdate: paint,
            onComplete: complete,
          });

          fallbackTimer = window.setTimeout(() => {
            state.value = 100;
            paint();
            complete();
          }, 1200);
          timers.add(fallbackTimer);
        });
        if (cancelled) return;

        if (labelRef.current) labelRef.current.textContent = 'Session ready';
        if (hintRef.current) hintRef.current.textContent = 'Entering the floor';
        if (statusRef.current) statusRef.current.textContent = 'Session ready. Entering the site.';
        if (progressRef.current) {
          progressRef.current.setAttribute('aria-valuenow', '100');
          progressRef.current.setAttribute('aria-valuetext', 'Session ready');
        }

        await wait(180);
        if (cancelled) return;

        root.classList.add('is-exiting');
        onReveal();

        let exitFinished = false;
        let exitFallbackTimer = 0;
        const completeExit = () => {
          if (exitFinished) return;
          exitFinished = true;
          window.clearTimeout(exitFallbackTimer);
          timers.delete(exitFallbackTimer);
          if (!cancelled) onDone();
        };

        exitTimeline = gsap.timeline({
          onComplete: completeExit,
        });

        exitTimeline
          .to('.preloader__ui', { opacity: 0, y: -12, duration: 0.28, ease: 'power2.in' }, 0)
          .to(
            ['.preloader__grid', '.preloader__glow', '.preloader__seam'],
            { opacity: 0, duration: 0.35, ease: 'power2.in' },
            0,
          )
          .to(
            '.preloader__panel--left',
            { xPercent: -101, duration: 0.95, ease: 'power4.inOut' },
            0.12,
          )
          .to(
            '.preloader__panel--right',
            { xPercent: 101, duration: 0.95, ease: 'power4.inOut' },
            0.12,
          );

        exitFallbackTimer = window.setTimeout(completeExit, 1600);
        timers.add(exitFallbackTimer);
      };

      Promise.race([readyTask, wait(MAX_LOAD_TIME)]).then(finish);

      return () => {
        cancelled = true;
        progressTween.kill();
        completionTween?.kill();
        exitTimeline?.kill();
        loadController.abort();
        timers.forEach((id) => window.clearTimeout(id));
        timers.clear();
        unlockScroll();
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="preloader"
      role="region"
      aria-label="Loading ANAS_TIME"
    >
      <div
        ref={progressRef}
        className="sr-only"
        role="progressbar"
        aria-label="Session preparation"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-valuetext="Preparing the session"
      />

      <div className="preloader__panels" aria-hidden="true">
        <span className="preloader__panel preloader__panel--left" />
        <span className="preloader__panel preloader__panel--right" />
      </div>

      <div className="preloader__grid" aria-hidden="true" />
      <div className="preloader__glow" aria-hidden="true" />
      <span className="preloader__seam" aria-hidden="true" />

      <div className="preloader__ui" aria-hidden="true">
        <div className="preloader__top">
          <span className="preloader__brand">
            <img src="/brand/monogram.svg" alt="" width="28" height="28" />
            ANAS<span>/</span>TIME
          </span>
          <span className="preloader__meta">
            Session 001
            <br />
            Marrakech, MA
          </span>
        </div>

        <div className="preloader__center">
          <span className="preloader__wordmark">
            ANAS<span>/</span>TIME
          </span>
          <span className="preloader__sub">Bodybuilding · Coaching · Marrakech</span>
        </div>

        <div className="preloader__bottom">
          <div className="preloader__status">
            <span className="label">
              <span className="label__dot" aria-hidden="true" />
              <span ref={labelRef}>Preparing the session</span>
            </span>
            <span className="preloader__hint" ref={hintRef}>
              Loading the athlete archive
            </span>
          </div>

          <div className="preloader__progress">
            <span className="preloader__count" ref={countRef}>
              000
            </span>
            <span className="preloader__percent">%</span>
            <span className="preloader__track">
              <span className="preloader__fill" ref={fillRef} />
            </span>
          </div>
        </div>
      </div>

      <p ref={statusRef} className="sr-only" role="status" aria-live="polite">
        Preparing the session.
      </p>
    </div>
  );
}
