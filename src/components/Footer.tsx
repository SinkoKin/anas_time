import { site } from '../content/site';
import { scrollToTarget } from '../lib/scroll';
import { ArrowUp, ArrowUpRight } from './Icons';
import './Footer.css';

export function Footer() {
  const { footer } = site;

  return (
    <footer className="footer" aria-labelledby="footer-title">
      <div className="container">
        <div className="footer__top">
          <div className="footer__intro">
            <p className="label footer__label">
              <span className="label__dot" aria-hidden="true" />
              05:00 / End of session
            </p>

            <h2 id="footer-title" className="footer__tagline">
              {footer.tagline}
            </h2>

            <p className="footer__place">
              {site.brand.location}
              <span aria-hidden="true"> / </span>
              {site.brand.coordinates}
            </p>

            <a
              className="footer__cta"
              href="#apply"
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget('apply');
              }}
            >
              Start your application
              <ArrowUpRight />
            </a>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            {footer.columns.map((column) => (
              <div className="footer__column" key={column.title}>
                <h3 className="footer__column-title">{column.title}</h3>
                <ul className="footer__links">
                  {column.links.map((link) => {
                    const internal = link.href.startsWith('#');

                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={internal ? undefined : '_blank'}
                          rel={internal ? undefined : 'noopener noreferrer'}
                          onClick={
                            internal
                              ? (event) => {
                                  event.preventDefault();
                                  scrollToTarget(link.href);
                                }
                              : undefined
                          }
                        >
                          {link.label}
                          <ArrowUpRight />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <a
          className="footer__mark"
          href="#top"
          aria-label={`${footer.wordmark} — ${footer.backToTop}`}
          onClick={(event) => {
            event.preventDefault();
            scrollToTarget('top', 0);
          }}
        >
          <span>ANAS</span>
          <span className="footer__mark-slash" aria-hidden="true">
            /
          </span>
          <span>TIME</span>
        </a>

        <div className="footer__bottom">
          <p>{footer.rights}</p>
          <p className="footer__credit">{footer.credit}</p>
          <button
            type="button"
            className="footer__top-link"
            onClick={() => scrollToTarget('top', 0)}
          >
            {footer.backToTop}
            <ArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
