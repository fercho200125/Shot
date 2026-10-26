import { business } from '../config';
import { asset } from '../lib/asset';
import { SECTIONS } from './Navbar';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="checker" aria-hidden="true" />
      <div className="footer__inner wrap">
        <div className="footer__brand">
          <img src={asset('img/brand/logo-256.webp')} width="88" height="88" alt="Mordida Burger" loading="lazy" />
          <p>
            Hamburguesas con pan de papa, 150 g de carne de res y salsa Mordida. Una mordida lo cambia todo.
          </p>
        </div>
        <nav aria-label="Pie de página">
          <p className="footer__heading">Explora</p>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>{s.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="footer__heading">Visítanos</p>
          {business.address && <p className="footer__muted">{business.address}</p>}
          {business.hours && <p className="footer__muted">{business.hours}</p>}
        </div>
        <div>
          <p className="footer__heading">Síguenos</p>
          {business.social.length ? (
            <ul>
              {business.social.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="footer__muted">Redes sociales por confirmar.</p>
          )}
        </div>
      </div>
      <p className="footer__legal wrap">© {new Date().getFullYear()} Mordida Burger. Precios en dólares (USD).</p>
    </footer>
  );
}
