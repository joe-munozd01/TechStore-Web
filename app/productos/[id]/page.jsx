import { notFound } from "next/navigation";
import { obtenerProductoPorId } from "../../../data/productos";
import DetalleProducto from "../../../components/DetalleProducto";

// En Next.js los parámetros de la ruta llegan como una promesa.
export default async function ProductoDetalle({ params }) {
  const { id } = await params;
  const producto = obtenerProductoPorId(id);
  if (!producto) notFound();
  return <DetalleProducto producto={producto} />;
}
