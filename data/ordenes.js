// ===== Fuente de datos simulada de órdenes de compra =====
import { leerJSON } from "../lib/almacenamiento";

let ordenes = [];

export function obtenerOrdenes() {
  return ordenes.map((o) => ({ ...o }));
}

// Agrega una orden con id consecutivo y fecha.
export function registrarOrden(orden) {
  const id = ordenes.reduce((max, o) => Math.max(max, o.id), 0) + 1;
  const nueva = { ...orden, id, fecha: new Date().toISOString() };
  ordenes.push(nueva);
  return { ...nueva };
}

export function cargarOrdenes(lista) {
  ordenes = lista.map((o) => ({ ...o }));
}

// Restaura las órdenes guardadas en el navegador.
export function cargarOrdenesGuardadas() {
  const guardadas = leerJSON("ts_ordenes", null);
  if (guardadas) cargarOrdenes(guardadas);
}

export function reiniciarOrdenes() {
  ordenes = [];
}
