import { site } from '../content/site';
import { ArrowUpRight, Instagram } from './Icons';
import { Picture } from './Picture';
import { SectionMeta } from './SectionMeta';
import './InstagramSection.css';

const tiles = [
  {
    image: 'athlete-front-lat' as const,
    alt: 'Anasse Time performing a front lat spread in the gym.',
    label: 'Physique',
    className: 'instagram__tile--tall',
  },
  {
    image: 'profile' as const,
    alt: 'Anasse Time flexing in the gym in Marrakech.',
    label: 'Training',
    className: '',
  },
  {
    image: 'athlete-front-double' as const,
    alt: 'Anasse Time holding a front double biceps pose.',
    label: 'Process',
    className: '',
  },
];

export function InstagramSection() {
  const { instagram } = site;

  return (
    <section id="instagram" className="instagram section" aria-labelledby="instagram-title">
      <div className="instagram__glow" aria-hidden="true" />
      <div className="container">
        <SectionMeta section={instagram.section} time={instagram.time} />

        <div className="instagram__grid">
          <div className="instagram__copy">
            <h2 id="instagram-title" className="h2 instagram__title" data-reveal>
              {instagram.title.map((line) => (
                <span className="instagram__title-line" key={line}>
                  {line}
                </span>
              ))}
            </h2>

            <p className="instagram__lead" data-reveal>
              {instagram.lead}
            </p>

            <a
              className="instagram__handle"
              href={site.brand.instagram}
              target="_blank"
              rel="noopener noreferrer"
              data-reveal
            >
              <Instagram />
              {instagram.handle}
              <ArrowUpRight />
            </a>

            <p className="instagram__note" data-reveal>
              {instagram.note}
            </p>
          </div>

          <div className="instagram__tiles">
            {tiles.map((tile) => (
              <a
                key={tile.image}
                className={`instagram__tile ${tile.className}`}
                href={site.brand.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${tile.label} — open @anas__time on Instagram`}
                data-reveal-image
              >
                <Picture
                  name={tile.image}
                  alt={tile.alt}
                  sizes="(max-width: 900px) 46vw, 24vw"
                  className="instagram__photo"
                  position="50% 26%"
                />
                <span className="instagram__tile-meta" aria-hidden="true">
                  <span>{tile.label}</span>
                  <span className="instagram__tile-icon">
                    <ArrowUpRight />
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
