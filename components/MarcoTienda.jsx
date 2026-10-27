'use client';
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

// Marco de la tienda (barra superior, contenedor y pie de página).
// El panel de administración (/admin) tiene su propio diseño, así que ahí no se muestra.
export default function MarcoTienda({ children }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;
  return (
    <>
      <Navbar />
      <main className="container py-4">{children}</main>
      <footer className="container py-3 text-muted small border-top">
        TechStore &copy; 2026 - DSY1104 Desarrollo Fullstack II
      </footer>
    </>
  );
}
