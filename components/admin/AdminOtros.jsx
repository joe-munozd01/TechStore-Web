'use client';
import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { obtenerUsuarios } from "../../data/usuarios";
import { ventasTotales, ticketPromedio, unidadesPorProducto } from "../../lib/reportes";
import { formatearPrecio } from "../ProductCard";
import useOrdenes from "./useOrdenes";

export function AdminUsuarios() {
  const { listo } = useAuth();
  const ordenes = useOrdenes();
  // Se vuelve a leer cuando la sesión termina de cargar (ahí se restauran las cuentas guardadas).
  const usuarios = useMemo(() => obtenerUsuarios(), [listo]);
  const comprasDe = (correo) => ordenes.filter((o) => o.ok && o.datos.correo.toLowerCase() === correo.toLowerCase()).length;

  return (
    <>
      <h1 className="h3 mb-3">Usuarios</h1>
      <div className="table-responsive">
        <table className="table table-striped align-middle bg-white">
          <thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Compras</th></tr></thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td><span className={"badge " + (u.rol === "admin" ? "text-bg-dark" : "text-bg-secondary")}>{u.rol}</span></td>
                <td>{comprasDe(u.correo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AdminReportes() {
  const ordenes = useOrdenes();
  const ranking = unidadesPorProducto(ordenes);
  return (
    <>
      <h1 className="h3 mb-3">Reportes</h1>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4"><div className="card"><div className="card-body"><p className="mb-1 text-muted">Ventas totales</p><p className="h4 mb-0">{formatearPrecio(ventasTotales(ordenes))}</p></div></div></div>
        <div className="col-12 col-md-4"><div className="card"><div className="card-body"><p className="mb-1 text-muted">Compras pagadas</p><p className="h4 mb-0">{ordenes.filter((o) => o.ok).length}</p></div></div></div>
        <div className="col-12 col-md-4"><div className="card"><div className="card-body"><p className="mb-1 text-muted">Ticket promedio</p><p className="h4 mb-0">{formatearPrecio(ticketPromedio(ordenes))}</p></div></div></div>
      </div>
      <h2 className="h5">Productos más vendidos</h2>
      <table className="table table-sm bg-white">
        <thead><tr><th>Producto</th><th>Unidades vendidas</th></tr></thead>
        <tbody>
          {ranking.map((r) => <tr key={r.nombre}><td>{r.nombre}</td><td>{r.unidades}</td></tr>)}
          {ranking.length === 0 && <tr><td colSpan={2} className="text-muted text-center">Todavía no hay ventas.</td></tr>}
        </tbody>
      </table>
    </>
  );
}

export function AdminPerfil() {
  const { usuario } = useAuth();
  if (!usuario) return null;
  return (
    <>
      <h1 className="h3 mb-3">Perfil</h1>
      <div className="card" style={{ maxWidth: 480 }}>
        <div className="card-body">
          <p className="mb-1"><strong>Nombre:</strong> {usuario.nombre} {usuario.apellidos}</p>
          <p className="mb-1"><strong>Correo:</strong> {usuario.correo}</p>
          <p className="mb-0"><strong>Rol:</strong> {usuario.rol}</p>
        </div>
      </div>
    </>
  );
}
