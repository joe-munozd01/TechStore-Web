import Link from "next/link";

// Tarjetas con los artículos del blog; cada una lleva a /blog/[slug].
export default function ListaBlog({ articulos }) {
  if (articulos.length === 0) {
    return <p className="alert alert-warning">Todavía no hay artículos publicados.</p>;
  }
  return (
    <div className="row g-3">
      {articulos.map((a) => (
        <div className="col-12 col-md-6" key={a.slug}>
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <p className="text-muted small mb-1">{new Date(a.fecha + "T12:00:00").toLocaleDateString("es-CL")}</p>
              <h2 className="h5">{a.titulo}</h2>
              <p>{a.resumen}</p>
              <Link href={"/blog/" + a.slug} className="btn btn-outline-primary btn-sm">Leer artículo</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
