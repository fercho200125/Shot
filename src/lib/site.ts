/** Información pública del negocio. Ajustar aquí cuando se confirmen datos reales. */
export const site = {
  brand: "Medistamp",
  owner: "Mery Pinargote",
  tagline: "Sellitos cute hechos con amor",
  city: "Manta – Ecuador",
  instagram: "https://instagram.com/medistamp.ec",
  instagramHandle: "@medistamp.ec",
  linktree: "https://linktr.ee/Medistamp.ec",
  /**
   * Número de WhatsApp en formato internacional sin "+" (ej. 5939XXXXXXXX).
   * PENDIENTE: vacío hasta confirmar. Con vacío, WhatsApp pide elegir el contacto.
   */
  whatsappNumber: "",
  currency: "USD",
} as const;

export function whatsappLink(text: string, number: string = site.whatsappNumber) {
  const base = number ? `https://wa.me/${number}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function formatPrice(value: number | null) {
  if (value == null) return "Por confirmar";
  return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value);
}
