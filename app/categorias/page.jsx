import { obtenerCategorias } from "../../data/productos";
import ListaCategorias from "../../components/ListaCategorias";

export default function Categorias() {
  return (
    <>
      <h1 className="h3 mb-3">Categorías</h1>
      <ListaCategorias categorias={obtenerCategorias()} />
    </>
  );
}
