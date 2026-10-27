// ===== Funciones puras para filtrar y agrupar productos =====

export const UMBRAL_STOCK_CRITICO = 10;

// "Periféricos" -> "perifericos" (se usa en la URL de la categoría).
export function crearSlug(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export function categoriasDe(productos) {
  const cantidades = {};
  productos.forEach((p) => {
    cantidades[p.categoria] = (cantidades[p.categoria] || 0) + 1;
  });
  return Object.keys(cantidades).map((nombre) => ({ nombre, slug: crearSlug(nombre), cantidad: cantidades[nombre] }));
}

export function porCategoria(productos, slug) {
  return productos.filter((p) => crearSlug(p.categoria) === slug);
}

export function ofertasDe(productos) {
  return productos.filter((p) => p.precioOferta !== null && p.precioOferta !== undefined);
}

// Productos con poco stock (incluye los agotados).
export function criticosDe(productos) {
  return productos.filter((p) => p.stock <= UMBRAL_STOCK_CRITICO);
}
