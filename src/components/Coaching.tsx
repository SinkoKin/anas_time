import { site } from '../content/site';
import { scrollToTarget } from '../lib/scroll';
import { ArrowUpRight } from './Icons';
import { SectionMeta } from './SectionMeta';
import './Coaching.css';

export function Coaching() {
  const { coaching } = site;

  return (
    <section id="coaching" className="coaching section" aria-labelledby="coaching-title">
      <div className="coaching__glow" aria-hidden="true" />
      <div className="container">
        <SectionMeta section={coaching.section} time={coaching.time} />

        <div className="coaching__head">
          <h2 id="coaching-title" className="h2 coaching__title" data-reveal>
            {coaching.title.map((line, index) => (
              <span
                className={`coaching__title-line ${index === coaching.title.length - 1 ? 'is-accent' : ''}`}
                key={line}
              >
                {line}
              </span>
            ))}
          </h2>

          <div className="coaching__head-side" data-reveal>
            <p className="lead">{coaching.lead}</p>
            <ul className="coaching__modes" aria-label="Coaching formats">
              {coaching.modes.map((mode) => (
                <li key={mode.label}>
                  <span className="coaching__mode-label">{mode.label}</span>
                  <span className="coaching__mode-detail">{mode.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="coaching__body">
          <div className="coaching__aside" data-reveal>
            <p className="label">
              <span className="label__dot" aria-hidden="true" />
              One-to-one
            </p>
            <p className="coaching__intro">{coaching.intro}</p>

            <a
              className="btn btn--outline coaching__cta"
              href="#apply"
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget('apply');
              }}
            >
              {coaching.cta}
              <ArrowUpRight />
            </a>

            <p className="coaching__note">{coaching.note}</p>
          </div>

          <ol className="coaching__services">
            {coaching.services.map((service) => (
              <li className="coaching__service" key={service.number} data-reveal>
                <span className="coaching__number" aria-hidden="true">
                  {service.number}
                </span>
                <div className="coaching__service-body">
                  <div className="coaching__service-top">
                    <h3 className="h3">{service.title}</h3>
                    <span className="coaching__tag">{service.tag}</span>
                  </div>
                  <p>{service.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
