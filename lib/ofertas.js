// Porcentaje de descuento de un producto en oferta (0 si no tiene oferta).
export function porcentajeDescuento(producto) {
  if (producto.precioOferta === null || producto.precioOferta === undefined) return 0;
  return Math.round((1 - producto.precioOferta / producto.precio) * 100);
}
