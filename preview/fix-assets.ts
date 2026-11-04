// Debe importarse primero: convierte las rutas públicas de los recursos en relativas.
import { demoAssets } from "@/lib/data/customization";
for (const a of demoAssets) if (a.src.startsWith("/")) a.src = a.src.slice(1);
