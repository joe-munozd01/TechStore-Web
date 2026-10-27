'use client';
import { createContext, useContext, useEffect, useState } from "react";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  cargarProductos,
} from "../data/productos";
import { guardarJSON, leerJSON } from "../lib/almacenamiento";

// Contexto de productos: todas las vistas (tienda y administrador) leen la misma lista,
// así lo que el administrador crea, edita o elimina se refleja en la tienda.
// Los cambios se guardan en localStorage para que sobrevivan a recargar la página.
const ProductosContext = createContext({
  productos: [],
  crear: () => null,
  actualizar: () => null,
  eliminar: () => false,
});

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState(() => obtenerProductos());

  useEffect(() => {
    const guardados = leerJSON("ts_productos", null);
    if (guardados) {
      cargarProductos(guardados);
      setProductos(obtenerProductos());
    }
  }, []);

  // Copia los datos al estado de React y al navegador después de cada cambio.
  const sincronizar = () => {
    const lista = obtenerProductos();
    setProductos(lista);
    guardarJSON("ts_productos", lista);
  };

  const valor = {
    productos,
    crear: (datos) => {
      const nuevo = crearProducto(datos);
      sincronizar();
      return nuevo;
    },
    actualizar: (id, cambios) => {
      const actualizado = actualizarProducto(id, cambios);
      sincronizar();
      return actualizado;
    },
    eliminar: (id) => {
      const eliminado = eliminarProducto(id);
      sincronizar();
      return eliminado;
    },
  };

  return <ProductosContext.Provider value={valor}>{children}</ProductosContext.Provider>;
}

export function useProductos() {
  return useContext(ProductosContext);
}
