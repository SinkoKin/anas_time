import { useEffect, useRef, useState } from 'react';
import { site } from '../content/site';
import { lockScroll, unlockScroll } from '../lib/scroll';
import { ArrowLeft, ArrowRight, ArrowUpRight, Close } from './Icons';
import { Picture } from './Picture';
import { SectionMeta } from './SectionMeta';
import './Gallery.css';

export function Gallery() {
  const { gallery } = site;
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const item = index !== null ? gallery.items[index] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      lockScroll();
    } else {
      if (dialog.open) dialog.close();
      unlockScroll();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setIndex((current) =>
          current === null ? null : (current + 1) % gallery.items.length,
        );
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setIndex((current) =>
          current === null
            ? null
            : (current - 1 + gallery.items.length) % gallery.items.length,
        );
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, gallery.items.length]);

  const step = (direction: number) => {
    setIndex((current) =>
      current === null
        ? null
        : (current + direction + gallery.items.length) % gallery.items.length,
    );
  };

  return (
    <section id="gallery" className="gallery section" aria-labelledby="gallery-title">
      <div className="container">
        <SectionMeta section={gallery.section} time={gallery.time} />

        <div className="gallery__head">
          <h2 id="gallery-title" className="h2 gallery__title" data-reveal>
            {gallery.title.map((line) => (
              <span className="gallery__title-line" key={line}>
                {line}
              </span>
            ))}
          </h2>
          <p className="gallery__lead" data-reveal>
            {gallery.lead}
          </p>
        </div>

        <ul className="gallery__grid">
          {gallery.items.map((image, imageIndex) => (
            <li
              className={`gallery__item gallery__item--${imageIndex + 1}`}
              key={image.image}
              data-reveal-image
            >
              <button
                type="button"
                className="gallery__button"
                aria-label={`${gallery.open}: ${image.title} — ${image.caption}`}
                onClick={() => setIndex(imageIndex)}
              >
                <Picture
                  name={image.image}
                  alt={image.alt}
                  sizes="(max-width: 700px) 100vw, (max-width: 1024px) 50vw, 46vw"
                  className="gallery__photo"
                  position="50% 28%"
                />
                <span className="gallery__overlay" aria-hidden="true">
                  <span className="gallery__index">0{imageIndex + 1}</span>
                  <span className="gallery__open-icon">
                    <ArrowUpRight />
                  </span>
                  <span className="gallery__caption">
                    <span>{image.title}</span>
                    <span>{image.caption}</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label={item ? `${item.title} — ${item.caption}` : 'Image viewer'}
        onClose={() => setIndex(null)}
      >
        {item && (
          <div className="lightbox__inner">
            <header className="lightbox__header">
              <div className="lightbox__ident">
                <span className="lightbox__count">
                  {String((index ?? 0) + 1).padStart(2, '0')} /{' '}
                  {String(gallery.items.length).padStart(2, '0')}
                </span>
                <span className="lightbox__title">{item.title}</span>
              </div>
              <button
                type="button"
                className="lightbox__close"
                aria-label={gallery.close}
                onClick={() => dialogRef.current?.close()}
              >
                <Close />
              </button>
            </header>

            <div
              className="lightbox__stage"
              onClick={(event) => {
                if (event.target === event.currentTarget) dialogRef.current?.close();
              }}
            >
              <button
                type="button"
                className="lightbox__nav lightbox__nav--prev"
                aria-label={gallery.previous}
                onClick={() => step(-1)}
              >
                <ArrowLeft />
              </button>

              <div className="lightbox__image-wrap">
                <Picture
                  name={item.image}
                  alt={item.alt}
                  sizes="(max-width: 900px) 92vw, 72vw"
                  className="lightbox__photo"
                  eager
                  position="50% 35%"
                />
              </div>

              <button
                type="button"
                className="lightbox__nav lightbox__nav--next"
                aria-label={gallery.next}
                onClick={() => step(1)}
              >
                <ArrowRight />
              </button>
            </div>

            <footer className="lightbox__footer">
              <p>{item.caption}</p>
              <p className="lightbox__hint">Use ← → to navigate</p>
            </footer>
          </div>
        )}
      </dialog>
    </section>
  );
}
