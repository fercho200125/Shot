import Link from "next/link";
import { Link2, MapPin, MessageCircle } from "lucide-react";
import { Instagram } from "@/components/InstagramIcon";
import { Logo } from "@/components/Logo";
import { categories } from "@/lib/data/categories";
import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
            Accesorios personalizados y sellitos cute hechos con amor. {site.city}.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute">Tienda</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/catalogo?categoria=${c.id}`} className="text-ink-soft hover:text-ink">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute">Experiencia</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/configurador" className="text-ink-soft hover:text-ink">Configurador 3D</Link></li>
            <li><Link href="/carrito" className="text-ink-soft hover:text-ink">Carrito</Link></li>
            <li><Link href="/#faq" className="text-ink-soft hover:text-ink">Preguntas frecuentes</Link></li>
            <li><Link href="/admin" className="text-ink-soft hover:text-ink">Panel administrativo</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute">Contacto</h3>
          <ul className="space-y-2.5 text-sm text-ink-soft">
            <li><a href={site.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink"><Instagram className="size-4" />{site.instagramHandle}</a></li>
            <li><a href={site.linktree} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink"><Link2 className="size-4" />linktr.ee/Medistamp.ec</a></li>
            <li><a href={whatsappLink("Hola Medistamp 💜, quisiera información.")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-ink"><MessageCircle className="size-4" />WhatsApp</a></li>
            <li className="inline-flex items-center gap-2"><MapPin className="size-4" />{site.city}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-ink-mute sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Medistamp · {site.owner}</p>
          <p>Precios, stock e imágenes de producto son de demostración hasta su confirmación.</p>
        </div>
      </div>
    </footer>
  );
}
