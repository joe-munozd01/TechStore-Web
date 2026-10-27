import { calcularTotal } from "./carrito";

// Número de orden simulado: #AAAAMMDD + 3 dígitos.
export function generarNumeroOrden() {
  const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return "#" + fecha + String(Math.floor(Math.random() * 900) + 100);
}

// Arma el resumen de la compra. "ok" indica si el pago fue exitoso o no.
export function crearOrden(datos, items, ok) {
  return {
    nro: generarNumeroOrden(),
    ok,
    datos: { ...datos },
    items: items.map((i) => ({ ...i })),
    total: calcularTotal(items),
  };
}
