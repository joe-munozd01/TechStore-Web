import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerArticulo, obtenerArticulos } from "../../../data/blog";

// Los artículos son fijos, así que las páginas se generan al compilar.
export function generateStaticParams() {
  return obtenerArticulos().map((a) => ({ slug: a.slug }));
}

export default async function Articulo({ params }) {
  const { slug } = await params;
  const articulo = obtenerArticulo(slug);
  if (!articulo) notFound();
  return (
    <article>
      <p className="mb-1"><Link href="/blog">&larr; Volver al blog</Link></p>
      <h1 className="h3">{articulo.titulo}</h1>
      <p className="text-muted small">{new Date(articulo.fecha + "T12:00:00").toLocaleDateString("es-CL")}</p>
      {articulo.contenido.map((parrafo, i) => <p key={i}>{parrafo}</p>)}
    </article>
  );
}
