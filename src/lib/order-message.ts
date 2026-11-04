import type { CartLine, StampDesign } from "./types";
import { getProduct } from "./data/products";
import { demoAssets, demoColors } from "./data/customization";
import { surfaces } from "./stamp-spec";
import { formatPrice } from "./site";

export function describeDesign(d: StampDesign) {
  const color = demoColors.find((c) => c.id === d.colorId)?.name ?? d.colorId;
  const text = d.printLines.filter((l) => l.trim()).join(" / ") || "(sin texto)";
  const decos = d.decorations.map((x) => {
    const a = demoAssets.find((a) => a.id === x.assetId);
    return `${a?.name ?? x.assetId} (${x.kind}) · ${surfaces[x.surface].label} · x ${x.x.toFixed(1)} cm, y ${x.y.toFixed(1)} cm, ${x.rotation}°`;
  });
  return { color, text, decos };
}

export function buildOrderMessage(lines: CartLine[], customer: { name: string; phone?: string; notes?: string }, orderId: string) {
  const out: string[] = [`Hola Medistamp 💜, quiero hacer un pedido.`, `Referencia: ${orderId}`, `Nombre: ${customer.name}`];
  if (customer.phone) out.push(`Teléfono: ${customer.phone}`);
  out.push("");
  lines.forEach((l, i) => {
    const p = getProduct(l.productId);
    if (l.type === "sello") {
      const d = describeDesign(l.design);
      out.push(`${i + 1}. Sello personalizado ×${l.qty}`);
      out.push(`   Color: ${d.color}`);
      out.push(`   Texto: ${d.text}`);
      if (d.decos.length) d.decos.forEach((x) => out.push(`   • ${x}`));
      else out.push("   Sin decoraciones");
    } else {
      const v = p?.variants.find((v) => v.id === l.variantId);
      out.push(`${i + 1}. ${p?.name ?? l.productId}${v ? ` (${v.name})` : ""} ×${l.qty}`);
    }
  });
  if (customer.notes) out.push("", `Notas: ${customer.notes}`);
  out.push("", "Precios referenciales a confirmar por la tienda.");
  return out.join("\n");
}

export { formatPrice };
