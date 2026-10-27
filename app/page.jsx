import Link from "next/link";
import { obtenerProductos } from "../data/productos";
import ProductosDestacados from "../components/ProductosDestacados";

export default function Home() {
  const destacados = obtenerProductos().slice(0, 3);
  return (
    <>
      <section className="p-4 mb-4 bg-body-tertiary rounded">
        <h1 className="h2">Bienvenido a TechStore</h1>
        <p className="mb-3">Notebooks, periféricos, componentes y accesorios con despacho a todo Chile.</p>
        <Link href="/productos" className="btn btn-primary">Ver productos</Link>
      </section>
      <h2 className="h4 mb-3">Productos destacados</h2>
      <ProductosDestacados productos={destacados} />
    </>
  );
}
