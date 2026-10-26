import { asset } from '../lib/asset';
import './About.css';

// Datos tomados del menú impreso.
const FACTS = [
  { title: 'Pan de papa', text: 'La base de todas nuestras hamburguesas.' },
  { title: '150 g de res', text: 'Carne de res en cada hamburguesa.' },
  { title: 'Salsa Mordida', text: 'La salsa de la casa en Meat, Hawaiana y Bacon Paradise.' },
  { title: 'Papas incluidas', text: 'Todas las hamburguesas vienen con papas fritas.' },
];

export function About() {
  return (
    <section id="nosotros" className="about" aria-labelledby="about-title">
      <div className="checker" aria-hidden="true" />
      <div className="about__inner wrap">
        <figure className="about__photo">
          <img
            src={asset('img/products/nosotros-2.webp')}
            srcSet={`${asset('img/products/nosotros-2-640.webp')} 640w, ${asset('img/products/nosotros-2.webp')} 1024w`}
            sizes="(min-width: 900px) 480px, 90vw"
            width="1024"
            height="683"
            alt="Hamburguesa con tocino y queso cheddar fundido sobre una tabla de madera, con una Hawaiana detrás"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div className="about__text">
          <p className="eyebrow">Nosotros</p>
          <h2 id="about-title" className="about__title">
            Hechas para morder sin pensarlo dos veces.
          </h2>
          <p className="about__lead">
            En Mordida Burger todo gira alrededor del primer bocado: pan de papa, carne de res y salsas que se
            reconocen al instante. Clásicas que no fallan e insignias para los que buscan algo más.
          </p>
          <ul className="facts">
            {FACTS.map((f) => (
              <li key={f.title}>
                <strong>{f.title}</strong>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figure className="about__band">
        <img
          src={asset('img/products/nosotros-1.webp')}
          srcSet={`${asset('img/products/nosotros-1-640.webp')} 640w, ${asset('img/products/nosotros-1.webp')} 1024w`}
          sizes="100vw"
          width="1024"
          height="683"
          alt="Hamburguesas Hawaiana y Spicy una junto a otra sobre una tabla de madera"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </section>
  );
}
