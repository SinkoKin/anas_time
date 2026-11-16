import { useRef } from 'react';
import { site } from '../content/site';
import { gsap, useGSAP } from '../lib/gsap';
import { ArrowRight } from './Icons';
import { SectionMeta } from './SectionMeta';
import './Process.css';

export function Process() {
  const root = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const { process } = site;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const viewport = viewportRef.current;
        const track = trackRef.current;
        const bar = barRef.current;
        if (!viewport || !track || !bar) return;

        const steps = gsap.utils.toArray<HTMLElement>('.process__step', track);
        const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
        const setProgress = gsap.quickSetter(bar, 'scaleX');
        let current = -1;

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${getDistance() + window.innerHeight * 0.55}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setProgress(self.progress);

              const index = Math.min(
                steps.length - 1,
                Math.round(self.progress * (steps.length - 1)),
              );

              if (index === current) return;
              current = index;
              steps.forEach((step, stepIndex) => {
                step.classList.toggle('is-active', stepIndex === index);
              });
              if (counterRef.current) {
                counterRef.current.textContent = `${String(index + 1).padStart(2, '0')} / ${String(
                  steps.length,
                ).padStart(2, '0')}`;
              }
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          steps.forEach((step) => step.classList.remove('is-active'));
          gsap.set(track, { clearProps: 'transform' });
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="process" ref={root} className="process" aria-labelledby="process-title">
      <div className="process__inner">
        <div className="container process__head">
          <SectionMeta section={process.section} time={process.time} />

          <div className="process__heading">
            <h2 id="process-title" className="h2 process__title" data-reveal>
              {process.title.map((line) => (
                <span className="process__title-line" key={line}>
                  {line}
                </span>
              ))}
            </h2>

            <div className="process__heading-side" data-reveal>
              <p className="lead">{process.lead}</p>
              <p className="process__scroll-note">
                <span className="process__scroll-icon" aria-hidden="true">
                  <ArrowRight />
                </span>
                {process.scrollNote}
                <span ref={counterRef} className="process__counter" aria-hidden="true">
                  01 / 04
                </span>
              </p>
            </div>
          </div>
        </div>

        <div ref={viewportRef} className="process__viewport">
          <ol ref={trackRef} className="process__track">
            {process.steps.map((step) => (
              <li className="process__step" key={step.number}>
                <div className="process__step-top">
                  <span className="process__number" aria-hidden="true">
                    {step.number}
                  </span>
                  <span className="process__meta">{step.meta}</span>
                </div>
                <h3 className="process__step-title">{step.title}</h3>
                <p className="process__step-copy">{step.description}</p>
                <span className="process__step-rule" aria-hidden="true">
                  <span />
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="process__progress" aria-hidden="true">
          <span ref={barRef} className="process__progress-bar" />
        </div>
      </div>
    </section>
  );
}
