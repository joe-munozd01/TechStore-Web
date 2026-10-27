'use client';
import { createContext, useContext, useState } from "react";
import * as logica from "../lib/carrito";

// Contexto: comparte el estado del carrito con cualquier componente (Navbar,
// tarjetas, página del carrito) sin pasar props de uno en uno.
// El valor por defecto no hace nada, así los componentes funcionan también sin Provider.
const CarritoContext = createContext({
  items: [],
  total: 0,
  unidades: 0,
  agregar: () => {},
  quitar: () => {},
  cambiarCantidad: () => {},
  vaciar: () => {},
});

export function CarritoProvider({ children, inicial = [] }) {
  const [items, setItems] = useState(inicial);

  const valor = {
    items,
    total: logica.calcularTotal(items),
    unidades: logica.contarUnidades(items),
    agregar: (producto) => setItems((actual) => logica.agregarItem(actual, producto)),
    quitar: (id) => setItems((actual) => logica.quitarItem(actual, id)),
    cambiarCantidad: (id, cantidad) => setItems((actual) => logica.cambiarCantidad(actual, id, cantidad)),
    vaciar: () => setItems([]),
  };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  return useContext(CarritoContext);
}
