import type { Metadata, Viewport } from "next";
import { Inter, Dancing_Script, Lora } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/modules/cart/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const script = Dancing_Script({ subsets: ["latin"], variable: "--font-script", display: "swap" });
const serif = Lora({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Medistamp · Sellitos cute hechos con amor", template: "%s · Medistamp" },
  description:
    "Sellos personalizados, figuras de goma, calcomanías, crochet y porta credenciales retráctiles. Diseña tu sello en 3D. Manta – Ecuador.",
  icons: { icon: "/brand/medistamp-mark.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f6f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${script.variable} ${serif.variable}`}>
      <body>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
