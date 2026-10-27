'use client';
import { useState } from "react";
import SearchBar from "./SearchBar";
import ProductList from "./ProductList";
import { useCarrito } from "../context/CarritoContext";

// Componente padre: guarda el estado del filtro (useState) y se lo pasa
// por props a SearchBar y a ProductList.
export default function Catalogo({ productos, onAgregar }) {
  const [filtro, setFiltro] = useState("");
  const { agregar } = useCarrito();

  const visibles = productos.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <section>
      <div className="mb-3">
        <SearchBar valor={filtro} onChange={setFiltro} />
      </div>
      <ProductList productos={visibles} onAgregar={onAgregar ?? agregar} />
    </section>
  );
}
