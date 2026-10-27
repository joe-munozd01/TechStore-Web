'use client';
import Link from "next/link";
import { useProductos } from "../context/ProductosContext";
import { categoriasDe, porCategoria, ofertasDe } from "../lib/catalogo";
import Catalogo from "./Catalogo";
import DetalleProducto from "./DetalleProducto";
import ListaCategorias from "./ListaCategorias";
import ProductosDestacados from "./ProductosDestacados";

// Páginas de la tienda. Son componentes de cliente porque leen los productos
// del contexto (así reflejan los cambios hechos desde el panel de administración).

export function InicioPagina() {
  const { productos } = useProductos();
  return (
    <>
      <section className="p-4 mb-4 bg-body-tertiary rounded">
        <h1 className="h2">Bienvenido a TechStore</h1>
        <p className="mb-3">Notebooks, periféricos, componentes y accesorios con despacho a todo Chile.</p>
        <Link href="/productos" className="btn btn-primary">Ver productos</Link>
      </section>
      <h2 className="h4 mb-3">Productos destacados</h2>
      <ProductosDestacados productos={productos.slice(0, 3)} />
    </>
  );
}

export function ProductosPagina() {
  const { productos } = useProductos();
  return (
    <>
      <h1 className="h3 mb-3">Catálogo de productos</h1>
      <Catalogo productos={productos} />
    </>
  );
}

export function CategoriasPagina() {
  const { productos } = useProductos();
  return (
    <>
      <h1 className="h3 mb-3">Categorías</h1>
      <ListaCategorias categorias={categoriasDe(productos)} />
    </>
  );
}

export function CategoriaPagina({ slug }) {
  const { productos } = useProductos();
  const lista = porCategoria(productos, slug);
  if (lista.length === 0) {
    return <div className="alert alert-warning">Categoría no encontrada. <Link href="/categorias">Ver categorías</Link></div>;
  }
  return (
    <>
      <p className="mb-1"><Link href="/categorias">&larr; Todas las categorías</Link></p>
      <h1 className="h3 mb-3">{lista[0].categoria}</h1>
      <Catalogo productos={lista} />
    </>
  );
}

export function OfertasPagina() {
  const { productos } = useProductos();
  return (
    <>
      <h1 className="h3 mb-3">Ofertas</h1>
      <Catalogo productos={ofertasDe(productos)} />
    </>
  );
}

export function DetallePagina({ id }) {
  const { productos } = useProductos();
  const producto = productos.find((p) => p.id === Number(id));
  if (!producto) {
    return <div className="alert alert-warning">Producto no encontrado. <Link href="/productos">Ver productos</Link></div>;
  }
  return <DetalleProducto producto={producto} />;
}
