'use client';
import Link from "next/link";
import { useCarrito } from "../context/CarritoContext";
import { formatearPrecio } from "./ProductCard";

// Resumen de la compra. exito=true -> compra realizada; exito=false -> pago con error.
export default function ResultadoCompra({ exito }) {
  const { orden } = useCarrito();

  if (!orden || orden.ok !== exito) {
    return (
      <div className="alert alert-info">
        No hay información de una compra reciente. <Link href="/productos">Ver productos</Link>
      </div>
    );
  }

  const { datos, items, total, nro } = orden;

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {exito ? (
          <h1 className="h4 text-success">Se ha realizado la compra. nro {nro}</h1>
        ) : (
          <>
            <h1 className="h4 text-danger">No se pudo realizar el pago. nro {nro}</h1>
            <Link href="/comprar" className="btn btn-success mb-3">Volver a realizar el pago</Link>
          </>
        )}

        <p className="mb-1"><strong>Cliente:</strong> {datos.nombre} {datos.apellidos} ({datos.correo})</p>
        <p className="mb-1">
          <strong>Entrega:</strong> {datos.calle}{datos.departamento ? ", " + datos.departamento : ""}, {datos.comuna}, {datos.region}
        </p>
        {datos.indicaciones && <p className="mb-1"><strong>Indicaciones:</strong> {datos.indicaciones}</p>}

        <div className="table-responsive mt-3">
          <table className="table table-sm">
            <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.nombre}</td>
                  <td>{formatearPrecio(i.precio)}</td>
                  <td>{i.cantidad}</td>
                  <td>{formatearPrecio(i.precio * i.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="h5 text-center" data-testid="total-orden">{exito ? "Total pagado: " : "Total a pagar: "}{formatearPrecio(total)}</p>
        {exito && <div className="text-center"><Link href="/productos" className="btn btn-primary">Seguir comprando</Link></div>}
      </div>
    </div>
  );
}
