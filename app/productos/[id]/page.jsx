import { DetallePagina } from "../../../components/PaginasTienda";

// En Next.js los parámetros de la ruta llegan como una promesa.
export default async function ProductoDetalle({ params }) {
  const { id } = await params;
  return <DetallePagina id={id} />;
}
