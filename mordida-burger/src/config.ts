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
  // VITE_WHATSAPP_NUMBER permite cambiarlo en el build sin tocar el código.
  whatsappNumber: (envNumber || '593984833313').replace(/\D/g, ''),
  address: 'Avenida J15 entre calles 294 y 295, barrio Jocay, Manta',
  hours: 'Todos los días, de 6:00 p. m. a 12:00 a. m.',
  // Ejemplo: { label: 'Instagram', url: 'https://instagram.com/…' }
  social: [],
};
