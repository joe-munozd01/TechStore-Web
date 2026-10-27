import Link from "next/link";

// Tarjetas de categorías (2 por fila en móvil, 4 en desktop). Cada una lleva a /categorias/[slug].
export default function ListaCategorias({ categorias }) {
  if (categorias.length === 0) {
    return <p className="alert alert-warning">No hay categorías disponibles.</p>;
  }
  return (
    <div className="row g-3">
      {categorias.map((c) => (
        <div className="col-6 col-md-3" key={c.slug}>
          <Link href={"/categorias/" + c.slug} className="card h-100 text-center text-decoration-none shadow-sm">
            <div className="card-body">
              <h2 className="h6 mb-1">{c.nombre}</h2>
              <span className="text-muted small">{c.cantidad} {c.cantidad === 1 ? "producto" : "productos"}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
