import { asset } from '../lib/asset';
import { ArrowDownIcon } from './Icons';
import './Hero.css';

export function Hero() {
  return (
    <section id="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero__photo">
        <img
          src={asset('img/products/bacon-paradise.webp')}
          srcSet={`${asset('img/products/bacon-paradise-640.webp')} 640w, ${asset('img/products/bacon-paradise.webp')} 1024w`}
          sizes="(min-width: 760px) 64vw, 100vw"
          width="1024"
          height="683"
          alt="Hamburguesa Bacon Paradise con tocino, queso cheddar fundido y salsa Mordida"
          fetchPriority="high"
        />
      </div>

      <div className="hero__content wrap">
        <img className="hero__logo" src={asset('img/brand/logo-512.webp')} width="512" height="512" alt="Mordida Burger" />
        <p className="eyebrow">Hamburguesas clásicas e insignias</p>
        <h1 id="hero-title" className="hero__title">
          Una mordida <span>lo cambia todo.</span>
        </h1>
        <p className="hero__lead">Descubre nuestras hamburguesas clásicas y especialidades.</p>
        <div className="hero__actions">
          <a className="btn" href="#menu">
            Explorar menú
            <ArrowDownIcon size={20} />
          </a>
        </div>
        <ul className="hero__facts" aria-label="En cada hamburguesa">
          <li>Pan de papa</li>
          <li>150 g de carne de res</li>
          <li>Papas fritas incluidas</li>
        </ul>
      </div>

      <div className="checker hero__checker" aria-hidden="true" />
    </section>
  );
}
