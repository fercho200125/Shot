import type { ReactNode } from 'react';
import { business } from '../config';
import { formatWhatsappNumber, isValidWhatsappNumber } from '../lib/order';
import { ChatIcon, ClockIcon, HeartIcon, PinIcon } from './Icons';
import './Contact.css';

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="contact__row">
      <span className="contact__icon">{icon}</span>
      <span>
        <span className="contact__label">{label}</span>
        <span className="contact__value">{children}</span>
      </span>
    </li>
  );
}

const pending = <span className="pending">Por confirmar</span>;

export function Contact({ onOpenCart }: { onOpenCart: () => void }) {
  const number = business.whatsappNumber;
  return (
    <section id="contacto" className="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="contact__card">
          <div className="contact__intro">
            <p className="eyebrow">Contacto</p>
            <h2 id="contact-title" className="contact__title">
              ¿Se te antojó?
            </h2>
            <p>Arma tu pedido aquí y envíalo por WhatsApp con un solo toque.</p>
            <div className="contact__actions">
              <a className="btn" href="#menu">
                Armar mi pedido
              </a>
              <button type="button" className="btn btn--glass" onClick={onOpenCart}>
                Ver mi pedido
              </button>
            </div>
          </div>
          <ul className="contact__list">
            <Row icon={<ChatIcon />} label="WhatsApp">
              {isValidWhatsappNumber(number) ? (
                <a href={`https://wa.me/${number}`} target="_blank" rel="noopener noreferrer">
                  {formatWhatsappNumber(number)}
                </a>
              ) : (
                pending
              )}
            </Row>
            <Row icon={<PinIcon />} label="Dirección">
              {business.address ?? pending}
            </Row>
            <Row icon={<ClockIcon />} label="Horario">
              {business.hours ?? pending}
            </Row>
            <Row icon={<HeartIcon />} label="Redes sociales">
              {business.social.length
                ? business.social.map((s, i) => (
                    <span key={s.url}>
                      {i > 0 && ' · '}
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.label}
                      </a>
                    </span>
                  ))
                : pending}
            </Row>
          </ul>
        </div>
      </div>
    </section>
  );
}
