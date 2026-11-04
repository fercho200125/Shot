import Link from "next/link";
import { Instagram } from "@/components/InstagramIcon";
import Image from "next/image";
import { ArrowRight, Hand, Link2, MessageCircle, Palette, Sparkles, Type, Undo2 } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { demoAssets, demoColors } from "@/lib/data/customization";
import { site, whatsappLink } from "@/lib/site";
import { ProductCard } from "@/modules/catalog/ProductCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Reveal } from "@/components/Reveal";
import { ButtonLink } from "@/components/Button";
import { StampThumb } from "@/modules/configurator/StampThumb";
import { PrintPreview } from "@/modules/configurator/PrintPreview";
import type { StampDesign } from "@/lib/types";

const heroDesign: StampDesign = {
  colorId: "lila",
  printLines: ["Dra. Ana Torres"],
  printFont: "sans",
  decorations: [
    { uid: "h1", assetId: "fig-osito", kind: "figura", surface: "frente", x: -1.3, y: 0.15, rotation: 8 },
    { uid: "h2", assetId: "stk-mariposa", kind: "calcomania", surface: "frente", x: 0.45, y: 0.55, rotation: -12 },
    { uid: "h3", assetId: "fig-corazon", kind: "figura", surface: "frente", x: 1.35, y: -0.45, rotation: -6 },
  ],
};

const faqs = [
  { q: "¿Cómo hago mi pedido?", a: "Diseña tu sello en el configurador 3D o elige productos del catálogo, agrégalos al carrito y envía el resumen por WhatsApp. Allí coordinamos los detalles contigo." },
  { q: "¿El texto del sello es el mismo que la decoración?", a: "No. La decoración (figuras y calcomanías) va en el cuerpo exterior del sello. El texto es lo que se imprime en el papel, y puedes verlo en la vista previa antes de pedir." },
  { q: "¿Las medidas que aparecen son exactas?", a: "Las medidas del configurador son referenciales y pueden variar ligeramente. Se confirman al momento del pedido." },
  { q: "¿Puedo mover y girar las figuras?", a: "Sí. Cada figura o calcomanía se puede mover dentro del área decorable y girar. Su tamaño es fijo, igual que en el producto real." },
  { q: "¿Cuánto tarda la elaboración y cómo es la entrega?", a: "El tiempo de elaboración y la forma de entrega se confirman por WhatsApp según tu pedido." },
];

export default function HomePage() {
  const featured = products.filter((p) => p.featured);
  return (
    <>
      {/* 2. HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 top-10 size-[520px] rounded-full bg-lila/30 blur-[120px]" />
          <div className="absolute -right-40 top-40 size-[420px] rounded-full bg-rosa/25 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 size-[360px] rounded-full bg-menta/20 blur-[120px]" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:pb-24">
          <div>
            <Reveal>
              <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-ink-soft">
                <span className="size-1.5 rounded-full bg-lila-deep" /> {site.city} · Hecho a mano
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 text-[44px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[72px]">
                Sellitos cute,
                <br />
                <span className="font-script text-[1.12em] font-semibold tracking-normal text-lila-deep">hechos con amor.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-soft">
                Sellos personalizados, figuras de goma, calcomanías y accesorios para que tu día de trabajo sea un poquito más tuyo.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/configurador" variant="lila" className="h-13 px-6 text-base">
                  <Sparkles className="size-4" /> Diseña tu sello en 3D
                </ButtonLink>
                <ButtonLink href="/catalogo" variant="glass" className="h-13 px-6 text-base">
                  Ver catálogo <ArrowRight className="size-4" />
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-[500px]">
              <div className="absolute inset-3 rounded-[48px] bg-gradient-to-br from-white via-lila-soft to-[#fbe9f1] shadow-[0_50px_100px_-50px_rgb(124_95_196/0.55)] ring-1 ring-white" />
              <div className="absolute inset-3 overflow-hidden rounded-[48px]">
                <div className="absolute -left-10 -top-10 size-60 rounded-full bg-white/70 blur-3xl" />
              </div>
              <div className="animate-float absolute left-[14%] right-[14%] top-[9%] bottom-[30%] drop-shadow-[0_30px_25px_rgb(60_40_110/0.22)]">
                <StampThumb design={heroDesign} className="size-full" />
              </div>
              <div className="absolute bottom-[7%] left-[8%] w-[56%] -rotate-[4deg] rounded-2xl bg-white p-1.5 shadow-[0_20px_40px_-20px_rgb(23_21_28/0.35)] ring-1 ring-line">
                <PrintPreview lines={heroDesign.printLines} font="sans" showGuide={false} className="w-full rounded-xl" />
              </div>
              {[
                { src: "/decor/figuras/estrella.svg", cls: "left-[2%] top-[6%] size-[15%]", r: "-12deg" },
                { src: "/decor/calcomanias/fresa.svg", cls: "right-[4%] top-[4%] size-[12%]", r: "10deg" },
                { src: "/decor/figuras/flor.svg", cls: "right-[6%] bottom-[12%] size-[17%]", r: "8deg" },
                { src: "/decor/calcomanias/luna.svg", cls: "right-[30%] bottom-[2%] size-[11%]", r: "-6deg" },
              ].map((f, i) => (
                <Image key={i} src={f.src} alt="" width={90} height={90} className={`animate-float absolute ${f.cls} drop-shadow-md`} style={{ ["--r" as string]: f.r, animationDelay: `${i * -1.4}s` }} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. ACCESO DESTACADO AL CONFIGURADOR */}
      <section className="px-3 sm:px-5">
        <Reveal>
          <div className="studio-bg relative mx-auto max-w-6xl overflow-hidden rounded-[36px] px-6 py-12 text-white sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-lila/25 blur-[100px]" />
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lila">Configurador 3D</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Diseña tu sello y míralo girar antes de pedirlo.</h2>
                <p className="mt-4 max-w-md text-white/65">Elige el color, decora con figuras y calcomanías, escribe tu texto y revisa cómo se verá impreso en papel.</p>
                <Link href="/configurador" className="mt-8 inline-flex h-13 items-center gap-2 rounded-full bg-white px-6 text-base font-medium text-ink transition hover:bg-white/90 active:scale-[0.98]">
                  <Sparkles className="size-4" /> Abrir configurador
                </Link>
              </div>
              <ol className="grid grid-cols-2 gap-3">
                {[
                  { i: Palette, t: "Color", d: "4 tonos para el cuerpo" },
                  { i: Hand, t: "Decora", d: "Mueve y gira cada pieza" },
                  { i: Type, t: "Tu texto", d: "Vista previa en papel" },
                  { i: Undo2, t: "Sin miedo", d: "Deshacer y rehacer" },
                ].map(({ i: I, t, d }, k) => (
                  <li key={t} className="glass-dark rounded-3xl p-5">
                    <span className="text-[11px] font-medium text-white/40">0{k + 1}</span>
                    <I className="mt-3 size-5 text-lila" strokeWidth={1.7} />
                    <p className="mt-3 font-medium">{t}</p>
                    <p className="text-sm text-white/55">{d}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 4. CATEGORÍAS */}
      <section id="categorias" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-24">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lila-deep">Categorías</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Explora por tipo de producto</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 50}>
              <Link href={`/catalogo?categoria=${c.id}`} className="card group relative flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-[26px] p-5 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute -right-10 -top-10 size-36 rounded-full opacity-60 blur-2xl transition-transform duration-700 group-hover:scale-125" style={{ background: c.tint }} />
                <span className="relative grid size-11 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                  <CategoryIcon icon={c.icon} className="size-5 text-ink" />
                </span>
                <div className="relative mt-6">
                  <p className="font-medium leading-tight">{c.name}</p>
                  <p className="mt-1 hidden text-sm text-ink-soft sm:block">{c.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. DESTACADOS */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lila-deep">Destacados</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Favoritos de la tienda</h2>
          </div>
          <Link href="/catalogo" className="hidden items-center gap-1 text-sm font-medium text-ink-soft hover:text-ink sm:inline-flex">Ver todo <ArrowRight className="size-4" /></Link>
        </Reveal>
        <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {featured.map((p) => (
            <div key={p.id} className="w-[78%] shrink-0 snap-start sm:w-auto"><ProductCard product={p} /></div>
          ))}
        </div>
      </section>

      {/* 6. PERSONALIZACIÓN */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lila-deep">Personalización</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Tres decisiones y tu sello queda único.</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Reveal className="card rounded-[28px] p-6">
            <p className="text-sm font-medium text-ink-mute">01 · Color</p>
            <div className="mt-6 flex gap-3">
              {demoColors.map((c) => (
                <span key={c.id} className="flex flex-col items-center gap-2">
                  <span className="size-12 rounded-full shadow-inner ring-1 ring-black/5" style={{ background: `radial-gradient(circle at 35% 30%, #fff8 0, transparent 45%), ${c.hex}` }} />
                  <span className="text-xs text-ink-soft">{c.name}</span>
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={80} className="card rounded-[28px] p-6">
            <p className="text-sm font-medium text-ink-mute">02 · Figuras y calcomanías</p>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {demoAssets.map((a) => (
                <Image key={a.id} src={a.src} alt={a.name} width={52} height={52} className="aspect-square w-full transition-transform duration-500 hover:-translate-y-1 hover:rotate-6" />
              ))}
            </div>
          </Reveal>
          <Reveal delay={160} className="card overflow-hidden rounded-[28px] p-6">
            <p className="text-sm font-medium text-ink-mute">03 · Texto de impresión</p>
            <PrintPreview lines={["Lic. María López", "Psicóloga Clínica"]} font="serif" showGuide={false} className="mt-4 w-full rounded-2xl ring-1 ring-line" />
          </Reveal>
        </div>
      </section>

      {/* 7. NOSOTROS */}
      <section id="nosotros" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-24">
        <div className="card grid items-center gap-10 overflow-hidden rounded-[36px] p-6 sm:p-10 md:grid-cols-[auto_1fr]">
          <Reveal className="mx-auto">
            <Image src="/brand/medistamp-logo.png" alt="Logotipo Mery Pinargote · Medistamp" width={240} height={240} className="size-52 rounded-full shadow-[0_30px_60px_-30px_rgb(124_95_196/0.6)] ring-1 ring-line sm:size-60" />
          </Reveal>
          <Reveal delay={100}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lila-deep">Sobre Medistamp</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Un emprendimiento de {site.owner}</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
              Desde {site.city}, creamos accesorios personalizados para profesionales y para quienes aman los detalles: sellos automáticos decorados, figuritas de goma, calcomanías, porta credenciales retráctiles y piezas de crochet.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Accesorios personalizados", "Sellitos cute", "Hecho con amor"].map((t) => (
                <span key={t} className="rounded-full bg-mist px-3 py-1.5 text-sm text-ink-soft">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 pt-24">
        <Reveal className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lila-deep">Preguntas frecuentes</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Lo que más nos preguntan</h2>
        </Reveal>
        <div className="mt-8 space-y-2">
          {faqs.map((f) => (
            <details key={f.q} className="card group rounded-3xl px-5 py-4 open:pb-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-mist transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 9. CONTACTO */}
      <section id="contacto" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-lila-soft via-white to-[#fdeef4] p-8 text-center ring-1 ring-line sm:p-14">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">¿Tienes una idea para tu sello?</h2>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">Escríbenos y te ayudamos a hacerla realidad.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={whatsappLink("Hola Medistamp 💜, quisiera información sobre un sello personalizado.")} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#1faa59] px-6 font-medium text-white shadow-[0_12px_30px_-12px_#1faa59] transition active:scale-[0.98]">
                <MessageCircle className="size-5" /> WhatsApp
              </a>
              <a href={site.instagram} target="_blank" rel="noreferrer" className="glass inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium"><Instagram className="size-5" /> {site.instagramHandle}</a>
              <a href={site.linktree} target="_blank" rel="noreferrer" className="glass inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium"><Link2 className="size-5" /> Linktree</a>
            </div>
            {!site.whatsappNumber && <p className="mt-5 text-xs text-ink-mute">Número de WhatsApp pendiente de configurar: el enlace abre WhatsApp para elegir el contacto.</p>}
          </div>
        </Reveal>
      </section>

    </>
  );
}
