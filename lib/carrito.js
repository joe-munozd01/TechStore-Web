// ===== Lógica pura del carrito (sin React): fácil de probar con Jasmine =====
// Un "item" del carrito es: { id, nombre, imagen, precio, stock, cantidad }

// Si el producto está en oferta se cobra el precio de oferta.
export function precioFinal(producto) {
  return producto.precioOferta ?? producto.precio;
}

export function agregarItem(items, producto) {
  const existente = items.find((i) => i.id === producto.id);
  if (existente) {
    if (existente.cantidad >= producto.stock) return items; // no pasar del stock
    return items.map((i) => (i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i));
  }
  if (producto.stock <= 0) return items;
  return [
    ...items,
    {
      id: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: precioFinal(producto),
      stock: producto.stock,
      cantidad: 1,
    },
  ];
}

export function quitarItem(items, id) {
  return items.filter((i) => i.id !== id);
}

export function cambiarCantidad(items, id, cantidad) {
  if (cantidad <= 0) return quitarItem(items, id);
  return items.map((i) => (i.id === id ? { ...i, cantidad: Math.min(cantidad, i.stock) } : i));
}

export function calcularTotal(items) {
  return items.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
}

export function contarUnidades(items) {
  return items.reduce((suma, i) => suma + i.cantidad, 0);
}
