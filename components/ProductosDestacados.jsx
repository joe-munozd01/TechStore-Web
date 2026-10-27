'use client';
import { useCarrito } from "../context/CarritoContext";
import ProductList from "./ProductList";

// La página de inicio es un componente de servidor; este pequeño componente de
// cliente conecta la lista con el carrito.
export default function ProductosDestacados({ productos }) {
  const { agregar } = useCarrito();
  return <ProductList productos={productos} onAgregar={agregar} />;
}
