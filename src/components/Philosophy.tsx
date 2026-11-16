import { useRef } from 'react';
import { site } from '../content/site';
import { gsap, useGSAP } from '../lib/gsap';
import { Picture } from './Picture';
import { SectionMeta } from './SectionMeta';
import './Philosophy.css';

export function Philosophy() {
  const root = useRef<HTMLElement>(null);
  const { philosophy } = site;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.philosophy__photo img',
          { yPercent: -3, scale: 1.07 },
          {
            yPercent: 3,
            scale: 1.07,
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="philosophy"
      ref={root}
      className="philosophy section"
      aria-labelledby="philosophy-title"
    >
      <div className="philosophy__glow" aria-hidden="true" />
      <div className="container">
        <SectionMeta section={philosophy.section} time={philosophy.time} />

        <div className="philosophy__grid">
          <div className="philosophy__intro">
            <h2 id="philosophy-title" className="h2 philosophy__title" data-reveal>
              {philosophy.title.map((line) => (
                <span className="philosophy__title-line" key={line}>
                  {line}
                </span>
              ))}
            </h2>
            <p className="lead philosophy__lead" data-reveal>
              {philosophy.lead}
            </p>
          </div>

          <figure className="philosophy__figure" data-reveal-image>
            <Picture
              name="athlete-front-double"
              alt="Anasse Time holding a front double biceps pose in the gym, wearing a black cap."
              sizes="(max-width: 900px) 100vw, 48vw"
              className="philosophy__photo"
              position="50% 24%"
            />
            <figcaption className="philosophy__quote">
              <span className="label philosophy__quote-label">
                <span className="label__dot" aria-hidden="true" />
                From the feed
              </span>
              <p>“{philosophy.quote}”</p>
              <cite>{philosophy.quoteSource}</cite>
            </figcaption>
            <span className="philosophy__vertical" aria-hidden="true">
              The standard / 04
            </span>
          </figure>

          <div className="philosophy__body">
            <ol className="philosophy__entries">
              {philosophy.entries.map((entry) => (
                <li className="philosophy__entry" key={entry.number} data-reveal>
                  <span className="philosophy__entry-number" aria-hidden="true">
                    {entry.number}
                  </span>
                  <div>
                    <h3 className="philosophy__entry-title">{entry.title}</h3>
                    <p className="philosophy__entry-copy">{entry.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="philosophy__arabic">
              <span className="label">Gratitude</span>
              <p lang="ar" dir="rtl">
                {philosophy.arabic}
              </p>
              <span className="philosophy__arabic-note">{philosophy.arabicNote}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
