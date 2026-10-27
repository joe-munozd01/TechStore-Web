import { obtenerProductos } from "../../data/productos";
import Catalogo from "../../components/Catalogo";

export default function Productos() {
  return (
    <>
      <h1 className="h3 mb-3">Catálogo de productos</h1>
      <Catalogo productos={obtenerProductos()} />
    </>
  );
}
