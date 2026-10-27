'use client';
import { createContext, useContext, useState } from "react";
import * as logica from "../lib/carrito";
import { crearOrden } from "../lib/pago";
import { registrarOrden, obtenerOrdenes, cargarOrdenesGuardadas } from "../data/ordenes";
import { guardarJSON } from "../lib/almacenamiento";

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
  orden: null,
  finalizarCompra: () => {},
});

export function CarritoProvider({ children, inicial = [], ordenInicial = null }) {
  const [items, setItems] = useState(inicial);
  const [orden, setOrden] = useState(ordenInicial);

  const valor = {
    items,
    total: logica.calcularTotal(items),
    unidades: logica.contarUnidades(items),
    agregar: (producto) => setItems((actual) => logica.agregarItem(actual, producto)),
    quitar: (id) => setItems((actual) => logica.quitarItem(actual, id)),
    cambiarCantidad: (id, cantidad) => setItems((actual) => logica.cambiarCantidad(actual, id, cantidad)),
    vaciar: () => setItems([]),
    orden,
    // Guarda el resumen de la compra; si el pago fue exitoso, vacía el carrito.
    finalizarCompra: (datos, ok) => {
      // Se registra la orden (pagada o rechazada) para que el administrador la vea.
      cargarOrdenesGuardadas();
      const nueva = registrarOrden(crearOrden(datos, items, ok));
      guardarJSON("ts_ordenes", obtenerOrdenes());
      setOrden(nueva);
      if (ok) setItems([]);
    },
  };

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  return useContext(CarritoContext);
}
