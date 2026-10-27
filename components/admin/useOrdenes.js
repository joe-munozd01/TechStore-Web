'use client';
import { useEffect, useState } from "react";
import { obtenerOrdenes, cargarOrdenesGuardadas } from "../../data/ordenes";

// Lee las órdenes guardadas en el navegador cuando se abre la pantalla.
export default function useOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  useEffect(() => {
    cargarOrdenesGuardadas();
    setOrdenes(obtenerOrdenes());
  }, []);
  return ordenes;
}
