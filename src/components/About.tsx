import { site } from '../content/site';
import { Picture } from './Picture';
import { SectionMeta } from './SectionMeta';
import './About.css';

export function About() {
  const { about } = site;

  return (
    <section id="athlete" className="about section" aria-labelledby="about-title">
      <div className="container">
        <SectionMeta section={about.section} time={about.time} />

        <div className="about__head">
          <h2 id="about-title" className="h2 about__title" data-reveal>
            <span className="about__title-line">{about.title[0]}</span>
            <span className="about__title-line about__title-line--indent">
              {about.title[1]}
            </span>
          </h2>
          <p className="about__lead" data-reveal>
            {about.lead}
          </p>
        </div>

        <div className="about__body">
          <figure className="about__figure" data-reveal-image>
            <Picture
              name="athlete-side"
              alt="Anasse Time holding a side chest pose in a dark gym, wearing a black cap and black shorts."
              sizes="(max-width: 900px) 100vw, 40vw"
              className="about__photo"
              position="50% 30%"
            />
            <figcaption className="about__figcaption">
              <span>Side chest</span>
              <span>Marrakech / MA</span>
            </figcaption>
          </figure>

          <div className="about__content">
            <div data-reveal>
              {about.paragraphs.map((paragraph) => (
                <p className="body-copy" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>

            <p className="about__signature" data-reveal>
              <span className="about__signature-mark" aria-hidden="true">
                A<span>/</span>T
              </span>
              {about.signature}
            </p>

            <dl className="about__facts" data-reveal>
              {about.facts.map((fact) => (
                <div className="about__fact" key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="about__record" data-reveal>
              <h3 className="label">
                <span className="label__dot" aria-hidden="true" />
                {about.recordLabel}
              </h3>
              <ul className="about__record-list">
                {about.record.map((item) => (
                  <li key={item}>
                    <span className="about__record-mark" aria-hidden="true">
                      +
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="about__source">{about.source}</p>
            </div>
          </div>
        </div>

        <blockquote className="about__quote" data-reveal>
          <p>“{about.quote}”</p>
          <cite>{about.quoteSource}</cite>
        </blockquote>
      </div>
    </section>
  );
}
