import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alsedo Osvaldo Lorenzo E Hijos",
  description: "Catálogo, pedidos y panel admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
