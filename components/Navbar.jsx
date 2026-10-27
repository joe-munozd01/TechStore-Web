'use client';
import Link from "next/link";
import { useState } from "react";
import { useCarrito } from "../context/CarritoContext";

// Menú responsive: en pantallas pequeñas se colapsa y el botón lo abre/cierra
// (estado "abierto"), usando las clases de Bootstrap.
export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { unidades } = useCarrito();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" href="/">TechStore</Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={"navbar-collapse collapse" + (abierto ? " show" : "")}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" href="/" onClick={() => setAbierto(false)}>Inicio</Link></li>
            <li className="nav-item"><Link className="nav-link" href="/productos" onClick={() => setAbierto(false)}>Productos</Link></li>
            <li className="nav-item"><Link className="nav-link" href="/categorias" onClick={() => setAbierto(false)}>Categorías</Link></li>
            <li className="nav-item"><Link className="nav-link" href="/ofertas" onClick={() => setAbierto(false)}>Ofertas</Link></li>
          </ul>
          <Link className="btn btn-light btn-sm" href="/carrito" onClick={() => setAbierto(false)}>
            Carrito
            {unidades > 0 && <span className="badge text-bg-primary ms-2">{unidades}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
