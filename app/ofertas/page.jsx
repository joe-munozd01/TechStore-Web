import { obtenerOfertas } from "../../data/productos";
import Catalogo from "../../components/Catalogo";

export default function Ofertas() {
  return (
    <>
      <h1 className="h3 mb-3">Ofertas</h1>
      <Catalogo productos={obtenerOfertas()} />
    </>
  );
}
