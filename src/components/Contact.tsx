import { site } from '../content/site';
import { scrollToTarget } from '../lib/scroll';
import { ArrowUpRight, Instagram, WhatsApp } from './Icons';
import { Picture } from './Picture';
import { SectionMeta } from './SectionMeta';
import './Contact.css';

export function Contact() {
  const { contact } = site;

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__bg" aria-hidden="true">
        <Picture
          name="athlete-front-lat"
          alt=""
          sizes="100vw"
          className="contact__photo"
          position="50% 20%"
        />
      </div>
      <div className="contact__overlay" aria-hidden="true" />

      <div className="container contact__inner">
        <SectionMeta section={contact.section} time={contact.time} />

        <div className="contact__content">
          <h2 id="contact-title" className="h2 contact__title" data-reveal>
            {contact.title.map((line) => (
              <span className="contact__title-line" key={line}>
                {line}
              </span>
            ))}
          </h2>

          <div className="contact__copy-block" data-reveal>
            <p className="contact__lead">{contact.lead}</p>
            <p className="contact__copy">{contact.copy}</p>
          </div>

          <div className="contact__actions" data-reveal>
            <a
              className="btn btn--primary"
              href="#apply"
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget('apply');
              }}
            >
              {contact.ctaPrimary}
              <ArrowUpRight />
            </a>
            <a
              className="btn btn--outline"
              href={site.brand.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp />
              {contact.ctaSecondary}
            </a>
          </div>

          <dl className="contact__channels">
            {contact.channels.map((channel) => (
              <div className="contact__channel" key={channel.label}>
                <dt>{channel.label}</dt>
                <dd>
                  {'href' in channel ? (
                    <a href={channel.href} target="_blank" rel="noopener noreferrer">
                      {channel.label === 'Instagram' && <Instagram />}
                      {channel.label === 'WhatsApp' && <WhatsApp />}
                      {channel.value}
                    </a>
                  ) : (
                    channel.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p className="contact__note">{contact.channelsNote}</p>
        </div>
      </div>
    </section>
  );
}
