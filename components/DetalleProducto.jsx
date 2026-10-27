'use client';
import Link from "next/link";
import { useCarrito } from "../context/CarritoContext";
import { formatearPrecio } from "./ProductCard";

// Detalle de un producto (dos columnas en desktop, una en móvil).
export default function DetalleProducto({ producto }) {
  const { agregar } = useCarrito();
  const sinStock = producto.stock === 0;
  const enOferta = producto.precioOferta !== null && producto.precioOferta !== undefined;

  return (
    <div className="row g-4">
      <div className="col-12 col-md-5">
        <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded border p-3" />
      </div>
      <div className="col-12 col-md-7">
        <h1 className="h3">{producto.nombre}</h1>
        <p className="text-muted">{producto.categoria} | {producto.marca}</p>
        <p>{producto.descripcion}</p>
        <p className="h4">
          {enOferta ? (
            <>
              <span className="text-decoration-line-through text-muted me-2 fs-6">{formatearPrecio(producto.precio)}</span>
              <span className="text-danger">{formatearPrecio(producto.precioOferta)}</span>
            </>
          ) : (
            formatearPrecio(producto.precio)
          )}
        </p>
        <p className={sinStock ? "text-danger" : "text-success"}>
          {sinStock ? "Sin stock" : "Stock disponible: " + producto.stock}
        </p>
        <button type="button" className="btn btn-primary me-2" disabled={sinStock} onClick={() => agregar(producto)}>
          Agregar al carrito
        </button>
        <Link href="/productos" className="btn btn-outline-secondary">Volver al catálogo</Link>
      </div>
    </div>
  );
}
