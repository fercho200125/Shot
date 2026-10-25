/**
 * Datos del negocio. Los campos en `null` se muestran como "Por confirmar".
 * Completa solo con información confirmada por Mordida Burger.
 */
export interface BusinessConfig {
  name: string;
  /** Número de WhatsApp con código de país, solo dígitos (ej. 593…). Vacío = envío desactivado. */
  whatsappNumber: string;
  address: string | null;
  hours: string | null;
  social: { label: string; url: string }[];
}

const envNumber = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? '';

export const business: BusinessConfig = {
  name: 'Mordida Burger',
  whatsappNumber: envNumber.replace(/\D/g, ''),
  address: null,
  hours: null,
  // Ejemplo: { label: 'Instagram', url: 'https://instagram.com/…' }
  social: [],
};
