'use client';
import Link from "next/link";
import { formatearPrecio } from "../ProductCard";
import useOrdenes from "./useOrdenes";

export function AdminOrdenes() {
  const ordenes = useOrdenes();
  return (
    <>
      <h1 className="h3 mb-3">Órdenes y boletas</h1>
      <div className="table-responsive">
        <table className="table table-striped align-middle bg-white">
          <thead><tr><th>N° orden</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {[...ordenes].reverse().map((o) => (
              <tr key={o.id}>
                <td>{o.nro}</td>
                <td>{new Date(o.fecha).toLocaleDateString("es-CL")}</td>
                <td>{o.datos.nombre} {o.datos.apellidos}</td>
                <td>{formatearPrecio(o.total)}</td>
                <td>{o.ok ? <span className="badge text-bg-success">Pagada</span> : <span className="badge text-bg-danger">Rechazada</span>}</td>
                <td><Link href={"/admin/ordenes/" + o.id} className="btn btn-sm btn-outline-primary">Ver boleta</Link></td>
              </tr>
            ))}
            {ordenes.length === 0 && <tr><td colSpan={6} className="text-center text-muted">Aún no hay órdenes registradas.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AdminBoleta({ id }) {
  const ordenes = useOrdenes();
  const orden = ordenes.find((o) => o.id === Number(id));
  if (!orden) {
    return <div className="alert alert-warning">Orden no encontrada. <Link href="/admin/ordenes">Volver a las órdenes</Link></div>;
  }
  const { datos } = orden;
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <p className="mb-1"><Link href="/admin/ordenes">&larr; Órdenes</Link></p>
        <h1 className="h4">Boleta {orden.nro}</h1>
        <p className="mb-1"><strong>Estado:</strong> {orden.ok ? "Pagada" : "Rechazada"}</p>
        <p className="mb-1"><strong>Cliente:</strong> {datos.nombre} {datos.apellidos} ({datos.correo})</p>
        <p className="mb-3"><strong>Entrega:</strong> {datos.calle}{datos.departamento ? ", " + datos.departamento : ""}, {datos.comuna}, {datos.region}</p>
        <div className="table-responsive">
          <table className="table table-sm">
            <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
            <tbody>
              {orden.items.map((i) => (
                <tr key={i.id}><td>{i.nombre}</td><td>{formatearPrecio(i.precio)}</td><td>{i.cantidad}</td><td>{formatearPrecio(i.precio * i.cantidad)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="h5 text-end mb-0">Total: {formatearPrecio(orden.total)}</p>
      </div>
    </div>
  );
}
