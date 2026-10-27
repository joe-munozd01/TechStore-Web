'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const enlaces = [
  { href: "/admin", texto: "Dashboard" },
  { href: "/admin/ordenes", texto: "Órdenes" },
  { href: "/admin/productos", texto: "Productos" },
  { href: "/admin/usuarios", texto: "Usuarios" },
  { href: "/admin/reportes", texto: "Reportes" },
  { href: "/admin/perfil", texto: "Perfil" },
];

// Diseño del panel: barra lateral + contenido. Solo entra el rol "admin".
export default function AdminLayout({ children }) {
  const { usuario, listo, cerrarSesion } = useAuth();
  const pathname = usePathname();

  if (!listo) return <p className="p-4">Cargando...</p>;

  if (!usuario) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Debes iniciar sesión para entrar al panel de administración. <Link href="/login">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  if (usuario.rol !== "admin") {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          No tienes permisos para ver el panel de administración. <Link href="/">Volver a la tienda</Link>
        </div>
      </div>
    );
  }

  const activo = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <aside className="bg-dark text-white p-3" style={{ minWidth: 220 }}>
        <p className="fs-5 fw-bold mb-3">TechStore Admin</p>
        <ul className="nav nav-pills flex-md-column gap-1">
          {enlaces.map((e) => (
            <li className="nav-item" key={e.href}>
              <Link href={e.href} className={"nav-link text-white" + (activo(e.href) ? " active" : "")}>{e.texto}</Link>
            </li>
          ))}
        </ul>
        <hr />
        <Link href="/" className="btn btn-light btn-sm w-100 mb-2">Ir a la tienda</Link>
        <button type="button" className="btn btn-danger btn-sm w-100" onClick={cerrarSesion}>Cerrar sesión</button>
      </aside>
      <section className="flex-grow-1 p-4 bg-body-tertiary">{children}</section>
    </div>
  );
}
