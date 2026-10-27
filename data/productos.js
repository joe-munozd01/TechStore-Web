// ===== Fuente de datos simulada (hace de "base de datos" de la tienda) =====
// Operaciones CRUD sobre un arreglo en memoria:
//   Crear -> crearProducto | Leer -> obtenerProductos / obtenerProductoPorId
//   Actualizar -> actualizarProducto | Eliminar -> eliminarProducto

const productosIniciales = [
  { id: 1, nombre: "Notebook Gamer X1", categoria: "Notebooks", marca: "Asus", descripcion: "Notebook para gaming y trabajo pesado, 16GB de RAM y tarjeta gráfica dedicada.", precio: 649990, precioOferta: null, stock: 8, imagen: "/img/notebook.jpg" },
  { id: 2, nombre: "Mouse Inalámbrico Pro", categoria: "Periféricos", marca: "Logitech", descripcion: "Mouse inalámbrico ergonómico con sensor de alta precisión.", precio: 19990, precioOferta: 14990, stock: 25, imagen: "/img/mouse-pro.jpg" },
  { id: 3, nombre: "Teclado Mecánico RGB", categoria: "Periféricos", marca: "SteelSeries", descripcion: "Teclado mecánico con retroiluminación RGB y switches rojos.", precio: 29990, precioOferta: null, stock: 14, imagen: "/img/teclado.jpg" },
  { id: 4, nombre: 'Monitor 27" 144Hz', categoria: "Componentes", marca: "MSI", descripcion: "Monitor de 27 pulgadas con tasa de refresco de 144Hz.", precio: 249990, precioOferta: 219990, stock: 6, imagen: "/img/monitor.webp" },
  { id: 5, nombre: "Disco SSD 1TB", categoria: "Componentes", marca: "Kingston", descripcion: "Unidad de estado sólido de 1TB, ideal para acelerar tu equipo.", precio: 54990, precioOferta: null, stock: 0, imagen: "/img/disco-duro.webp" },
  { id: 6, nombre: "Mochila Antirrobo", categoria: "Accesorios", marca: "UrbanTech", descripcion: "Mochila para notebook de hasta 15.6 pulgadas con cierre oculto.", precio: 24990, precioOferta: null, stock: 30, imagen: "/img/mochila.avif" },
];

// Copia para no modificar el arreglo original (así se puede reiniciar).
let productos = productosIniciales.map((p) => ({ ...p }));

// READ
export function obtenerProductos() {
  return productos.map((p) => ({ ...p }));
}

export function obtenerProductoPorId(id) {
  const encontrado = productos.find((p) => p.id === Number(id));
  return encontrado ? { ...encontrado } : null;
}

// CREATE
export function crearProducto(datos) {
  const siguienteId = productos.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const nuevo = { precioOferta: null, stock: 0, ...datos, id: siguienteId };
  productos.push(nuevo);
  return { ...nuevo };
}

// UPDATE
export function actualizarProducto(id, cambios) {
  const indice = productos.findIndex((p) => p.id === Number(id));
  if (indice === -1) return null;
  productos[indice] = { ...productos[indice], ...cambios, id: productos[indice].id };
  return { ...productos[indice] };
}

// DELETE
export function eliminarProducto(id) {
  const antes = productos.length;
  productos = productos.filter((p) => p.id !== Number(id));
  return productos.length < antes;
}

// Útil para las pruebas unitarias: deja los datos como al inicio.
export function reiniciarProductos() {
  productos = productosIniciales.map((p) => ({ ...p }));
}

// ===== Categorías y ofertas =====

// "Periféricos" -> "perifericos" (se usa en la URL de la categoría).
export function crearSlug(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

// Lista de categorías con la cantidad de productos de cada una.
export function obtenerCategorias() {
  const cantidades = {};
  productos.forEach((p) => {
    cantidades[p.categoria] = (cantidades[p.categoria] || 0) + 1;
  });
  return Object.keys(cantidades).map((nombre) => ({
    nombre,
    slug: crearSlug(nombre),
    cantidad: cantidades[nombre],
  }));
}

export function obtenerProductosPorCategoria(slug) {
  return productos.filter((p) => crearSlug(p.categoria) === slug).map((p) => ({ ...p }));
}

// Productos que tienen precio de oferta.
export function obtenerOfertas() {
  return productos
    .filter((p) => p.precioOferta !== null && p.precioOferta !== undefined)
    .map((p) => ({ ...p }));
}
