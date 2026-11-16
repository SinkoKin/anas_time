import { useRef } from 'react';
import { site } from '../content/site';
import { gsap, useGSAP } from '../lib/gsap';
import { scrollToTarget } from '../lib/scroll';
import { ArrowDown, ArrowUpRight } from './Icons';
import { Picture } from './Picture';
import './Hero.css';

type HeroProps = {
  active: boolean;
  complete: boolean;
};

export function Hero({ active, complete }: HeroProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (!active) return;

        const timeline = gsap.timeline({
          paused: true,
          delay: 0.1,
          defaults: { ease: 'power3.out' },
        });

        timeline
          .from('.hero__grid', { opacity: 0, duration: 1.4, ease: 'power2.out' }, 0)
          .from('.hero__glow', { opacity: 0, scale: 0.85, duration: 1.7, ease: 'power2.out' }, 0)
          .from(
            '.hero__photo',
            { clipPath: 'inset(0 0 100% 0)', duration: 1.4, ease: 'power4.inOut' },
            0.05,
          )
          .from('.hero__photo img', { scale: 1.14, duration: 1.9, ease: 'power3.out' }, 0.05)
          .from(
            '.hero__line-inner',
            { yPercent: 118, duration: 1.25, stagger: 0.12, ease: 'power4.out' },
            0.35,
          )
          .from(
            '[data-hero-fade]',
            { opacity: 0, y: 22, duration: 0.9, stagger: 0.09 },
            0.8,
          )
          .from('.hero__frame', { opacity: 0, duration: 1 }, 0.95)
          .from('.hero__caption', { opacity: 0, y: 10, duration: 0.9 }, 1)
          .from('.hero__scroll', { opacity: 0, y: 12, duration: 0.9 }, 1.15);

        if (complete) timeline.progress(1);
        else timeline.play();

        return () => timeline.kill();
      });

      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.to('.hero__photo-parallax', {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to('.hero__copy', {
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.to('.hero__ghost', {
          xPercent: -2,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      mm.add(
        '(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const hero = root.current;
          if (!hero) return;

          const photoX = gsap.quickTo('.hero__photo-parallax', 'x', {
            duration: 1.2,
            ease: 'power3.out',
          });
          const photoY = gsap.quickTo('.hero__photo-parallax', 'y', {
            duration: 1.2,
            ease: 'power3.out',
          });
          const glowX = gsap.quickTo('.hero__glow', 'x', {
            duration: 1.4,
            ease: 'power3.out',
          });
          const glowY = gsap.quickTo('.hero__glow', 'y', {
            duration: 1.4,
            ease: 'power3.out',
          });

          const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType !== 'mouse') return;
            const rect = hero.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const nx = (event.clientX - rect.left) / rect.width - 0.5;
            const ny = (event.clientY - rect.top) / rect.height - 0.5;

            photoX(nx * 16);
            photoY(ny * 20);
            glowX(nx * -34);
            glowY(ny * -28);
          };

          const reset = () => {
            photoX(0);
            photoY(0);
            glowX(0);
            glowY(0);
          };

          hero.addEventListener('pointermove', onPointerMove);
          hero.addEventListener('pointerleave', reset);

          return () => {
            hero.removeEventListener('pointermove', onPointerMove);
            hero.removeEventListener('pointerleave', reset);
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [active, complete] },
  );

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__ghost" aria-hidden="true">
        TIME
      </div>

      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="label hero__eyebrow" data-hero-fade>
            <span className="label__dot" aria-hidden="true" />
            {site.hero.eyebrow}
          </p>

          <h1 id="hero-title" className="display hero__title">
            {site.hero.lines.map((line) => (
              <span className="hero__line" key={line}>
                <span className="hero__line-inner">{line}</span>
              </span>
            ))}
          </h1>

          <p className="hero__support" data-hero-fade>
            {site.hero.support}
          </p>

          <div className="hero__actions" data-hero-fade>
            <a
              className="btn btn--primary"
              href="#apply"
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget('apply');
              }}
            >
              {site.hero.ctaPrimary}
              <ArrowUpRight />
            </a>
            <a
              className="btn btn--ghost hero__explore"
              href="#coaching"
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget('coaching');
              }}
            >
              {site.hero.ctaSecondary}
              <ArrowDown />
            </a>
          </div>

          <dl className="hero__credentials" data-hero-fade>
            {site.hero.credentials.map((item) => (
              <div className="hero__credential" key={item.label}>
                <dd>{item.value}</dd>
                <dt>{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <figure className="hero__figure">
          <div className="hero__photo-parallax">
            <Picture
              name="profile"
              alt="Anasse Time flexing in a dark gym in Marrakech, with blue strength equipment behind him."
              sizes="(max-width: 900px) 100vw, 42vw"
              className="hero__photo"
              eager
              position="50% 28%"
            />
          </div>
          <div className="hero__frame" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <figcaption className="hero__caption">
            <span>{site.hero.caption}</span>
            <span className="hero__vertical" aria-hidden="true">
              {site.hero.vertical}
            </span>
          </figcaption>
        </figure>

        <div className="hero__scroll" aria-hidden="true">
          <span className="hero__scroll-label">{site.hero.scroll}</span>
          <span className="hero__scroll-line" />
        </div>
      </div>
    </section>
  );
}
