import type { Metadata, Viewport } from "next";
import { Configurator } from "@/modules/configurator/Configurator";

export const metadata: Metadata = {
  title: "Configurador 3D",
  description: "Diseña tu sello personalizado en 3D: color, figuras, calcomanías y texto con vista previa en papel.",
};

export const viewport: Viewport = { themeColor: "#0d0d10", width: "device-width", initialScale: 1, maximumScale: 1, viewportFit: "cover" };

export default function ConfiguratorPage() {
  return <Configurator />;
}
