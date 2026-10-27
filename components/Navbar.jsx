'use client';
import Link from "next/link";
import { useState } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

// Menú responsive: en pantallas pequeñas se colapsa y el botón lo abre/cierra
// (estado "abierto"), usando las clases de Bootstrap.
export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { unidades } = useCarrito();
  const { usuario, cerrarSesion } = useAuth();
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
          <div className="d-flex flex-wrap align-items-center gap-2">
            {usuario ? (
              <>
                <span className="navbar-text text-white me-1">Hola, {usuario.nombre}</span>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={() => { cerrarSesion(); setAbierto(false); }}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" href="/login" onClick={() => setAbierto(false)}>Iniciar sesión</Link>
                <Link className="btn btn-outline-light btn-sm" href="/registro" onClick={() => setAbierto(false)}>Crear cuenta</Link>
              </>
            )}
            <Link className="btn btn-light btn-sm" href="/carrito" onClick={() => setAbierto(false)}>
              Carrito
              {unidades > 0 && <span className="badge text-bg-primary ms-2">{unidades}</span>}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
