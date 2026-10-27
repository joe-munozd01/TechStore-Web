'use client';
import Link from "next/link";
import { useCarrito } from "../context/CarritoContext";
import { formatearPrecio } from "./ProductCard";

// Vista del carrito: tabla con cantidades editables, total y botón para vaciar.
export default function CarritoVista() {
  const { items, total, quitar, cambiarCantidad, vaciar } = useCarrito();

  if (items.length === 0) {
    return (
      <div className="alert alert-info">
        Tu carrito está vacío. <Link href="/productos">Ver productos</Link>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{formatearPrecio(item.precio)}</td>
                <td>
                  <div className="btn-group btn-group-sm" role="group">
                    <button type="button" className="btn btn-outline-secondary" aria-label={"Disminuir " + item.nombre} onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}>-</button>
                    <span className="btn btn-light disabled" data-testid={"cantidad-" + item.id}>{item.cantidad}</span>
                    <button type="button" className="btn btn-outline-secondary" aria-label={"Aumentar " + item.nombre} onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}>+</button>
                  </div>
                </td>
                <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                <td>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => quitar(item.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <button type="button" className="btn btn-outline-secondary" onClick={vaciar}>Vaciar carrito</button>
        <p className="h5 mb-0">Total: <strong data-testid="total">{formatearPrecio(total)}</strong></p>
      </div>
    </>
  );
}
