import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { site } from '../content/site';
import { lockScroll, scrollToTarget, unlockScroll } from '../lib/scroll';
import { ArrowUpRight, Instagram } from './Icons';
import './Navbar.css';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let frame = 0;
    const ids = site.nav.map((item) => item.href.replace('#', ''));

    const update = () => {
      frame = 0;
      const marker = window.innerHeight * 0.4;
      let current: string | null = null;

      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= marker) {
          current = `#${id}`;
        }
      });

      setActiveHref((previous) => (previous === current ? previous : current));
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

  useEffect(() => {
    if (!open) return;

    lockScroll();
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusables?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        window.requestAnimationFrame(() => toggleRef.current?.focus());
        return;
      }

      if (event.key !== 'Tab' || !focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      unlockScroll();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, [open]);

  const go = (href: string) => {
    const id = href.replace('#', '');
    if (open) {
      setOpen(false);
      unlockScroll();
      window.requestAnimationFrame(() => scrollToTarget(id));
    } else {
      scrollToTarget(id);
    }
  };

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__bar container">
        <a
          className="nav__brand"
          href="#top"
          aria-label="ANAS_TIME — back to top"
          onClick={(event) => {
            event.preventDefault();
            go('#top');
          }}
        >
          <img src="/brand/monogram.svg" alt="" width="34" height="34" aria-hidden="true" />
          <span className="nav__wordmark">
            ANAS<span className="nav__slash">/</span>TIME
          </span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav__link ${activeHref === item.href ? 'is-active' : ''}`}
              aria-current={activeHref === item.href ? 'location' : undefined}
              onClick={(event) => {
                event.preventDefault();
                go(item.href);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <a
            className="nav__social"
            href={site.brand.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ANAS_TIME on Instagram"
          >
            <Instagram />
          </a>
          <a
            className="btn btn--primary nav__apply"
            href="#apply"
            onClick={(event) => {
              event.preventDefault();
              go('#apply');
            }}
          >
            Apply
            <ArrowUpRight />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="nav__toggle-icon" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="nav__toggle-label" aria-hidden="true">
              {open ? 'Close' : 'Menu'}
            </span>
          </button>
        </div>
      </div>

      {open &&
        createPortal(
          <div
            id="mobile-menu"
            ref={panelRef}
            className="nav__menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="nav__menu-inner container">
              <p className="label nav__menu-label">
                <span className="label__dot" aria-hidden="true" />
                Menu / {site.brand.location}
              </p>

              <nav className="nav__menu-links" aria-label="Mobile">
                {site.nav.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`nav__menu-link ${activeHref === item.href ? 'is-active' : ''}`}
                    style={{ '--menu-i': index } as CSSProperties}
                    aria-current={activeHref === item.href ? 'location' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      go(item.href);
                    }}
                  >
                    <span className="nav__menu-num">0{index + 1}</span>
                    {item.label}
                  </a>
                ))}
                <a
                  href="#apply"
                  className="nav__menu-link nav__menu-link--apply"
                  style={{ '--menu-i': site.nav.length } as CSSProperties}
                  onClick={(event) => {
                    event.preventDefault();
                    go('#apply');
                  }}
                >
                  <span className="nav__menu-num">0{site.nav.length + 1}</span>
                  Apply
                </a>
              </nav>

              <div className="nav__menu-footer">
                <a href={site.brand.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram />
                  {site.brand.handle}
                </a>
                <a href={site.brand.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp — {site.brand.whatsappDisplay}
                </a>
                <span>{site.brand.coordinates}</span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
