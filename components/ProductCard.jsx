'use client';

export function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CL");
}

// Tarjeta de un producto. Datos por props; el botón avisa con onAgregar.
export default function ProductCard({ producto, onAgregar = () => {} }) {
  const sinStock = producto.stock === 0;
  const enOferta = producto.precioOferta !== null && producto.precioOferta !== undefined;

  return (
    <div className="card h-100 shadow-sm">
      <img src={producto.imagen} className="card-img-top" alt={producto.nombre} style={{ height: 180, objectFit: "contain" }} />
      <div className="card-body d-flex flex-column">
        <h3 className="h6 card-title">{producto.nombre}</h3>
        <p className="text-muted small mb-1">{producto.categoria} | {producto.marca}</p>
        <p className="mb-2">
          {enOferta ? (
            <>
              <span className="text-decoration-line-through text-muted me-2">{formatearPrecio(producto.precio)}</span>
              <strong className="text-danger">{formatearPrecio(producto.precioOferta)}</strong>
            </>
          ) : (
            <strong>{formatearPrecio(producto.precio)}</strong>
          )}
        </p>
        {sinStock && <span className="badge text-bg-secondary mb-2 align-self-start">Sin stock</span>}
        <button
          type="button"
          className="btn btn-primary mt-auto"
          disabled={sinStock}
          onClick={() => onAgregar(producto)}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
