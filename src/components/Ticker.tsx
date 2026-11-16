import { site } from '../content/site';
import './Ticker.css';

export function Ticker() {
  const items = site.ticker;

  return (
    <section className="ticker" aria-label="Competition record and location">
      <div className="ticker__inner">
        <span className="ticker__label">
          Record <span aria-hidden="true">/ 23—25</span>
        </span>
        <div className="ticker__viewport">
          <div className="ticker__track">
            {items.map((item) => (
              <span className="ticker__item" key={item}>
                {item}
                <span className="ticker__sep" aria-hidden="true">
                  /
                </span>
              </span>
            ))}
            {items.map((item) => (
              <span className="ticker__item" key={`dup-${item}`} aria-hidden="true">
                {item}
                <span className="ticker__sep">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
