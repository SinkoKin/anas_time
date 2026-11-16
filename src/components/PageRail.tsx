import { useEffect, useRef, useState } from 'react';
import { site } from '../content/site';
import { scrollToTarget } from '../lib/scroll';
import './PageRail.css';

const sections = [
  { id: 'top', label: 'Intro', time: site.hero.time },
  { id: 'athlete', label: 'Athlete', time: site.about.time },
  { id: 'coaching', label: 'Coaching', time: site.coaching.time },
  { id: 'process', label: 'Process', time: site.process.time },
  { id: 'philosophy', label: 'Standard', time: site.philosophy.time },
  { id: 'gallery', label: 'Gallery', time: site.gallery.time },
  { id: 'instagram', label: 'Instagram', time: site.instagram.time },
  { id: 'apply', label: 'Apply', time: site.apply.time },
  { id: 'contact', label: 'Contact', time: site.contact.time },
] as const;

export function PageRail() {
  const [active, setActive] = useState(0);
  const fillRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const marker = window.innerHeight * 0.38;
      let index = 0;

      sections.forEach((section, sectionIndex) => {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= marker) index = sectionIndex;
      });

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${progress})`;
      }

      if (index !== activeRef.current) {
        activeRef.current = index;
        setActive(index);
        if (timeRef.current) timeRef.current.textContent = sections[index].time;
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav className="rail" aria-label="Session progress">
      <span className="rail__time" ref={timeRef} aria-hidden="true">
        {sections[0].time}
      </span>

      <div className="rail__track">
        <span className="rail__line" aria-hidden="true">
          <span className="rail__fill" ref={fillRef} />
        </span>

        {sections.map((section, index) => (
          <button
            key={section.id}
            type="button"
            className={`rail__dot ${index === active ? 'is-active' : ''}`}
            aria-label={`Go to ${section.label}`}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => scrollToTarget(section.id, section.id === 'top' ? 0 : -78)}
          >
            <span className="rail__dot-label" aria-hidden="true">
              {section.label}
            </span>
          </button>
        ))}
      </div>

      <span className="rail__count" aria-hidden="true">
        {String(active + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
      </span>
    </nav>
  );
}
