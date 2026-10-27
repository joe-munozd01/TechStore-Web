'use client';
import ProductCard from "./ProductCard";

// Grilla responsive de Bootstrap: 1 columna en móvil, 2 en tablet, 3 en desktop.
export default function ProductList({ productos, onAgregar = () => {} }) {
  if (productos.length === 0) {
    return <p className="alert alert-warning">No se encontraron productos.</p>;
  }
  return (
    <div className="row g-3">
      {productos.map((producto) => (
        <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
          <ProductCard producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}
