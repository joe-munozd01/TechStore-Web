import Link from "next/link";
import { notFound } from "next/navigation";
import { obtenerProductosPorCategoria } from "../../../data/productos";
import Catalogo from "../../../components/Catalogo";

export default async function Categoria({ params }) {
  const { slug } = await params;
  const productos = obtenerProductosPorCategoria(slug);
  if (productos.length === 0) notFound();
  return (
    <>
      <p className="mb-1"><Link href="/categorias">&larr; Todas las categorías</Link></p>
      <h1 className="h3 mb-3">{productos[0].categoria}</h1>
      <Catalogo productos={productos} />
    </>
  );
}
