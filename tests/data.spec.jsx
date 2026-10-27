import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  reiniciarProductos,
} from "../data/productos";

describe("data/productos (CRUD)", () => {
  beforeEach(() => reiniciarProductos());

  it("crearProducto agrega un producto con un id nuevo", () => {
    const antes = obtenerProductos().length;
    const nuevo = crearProducto({ nombre: "Webcam HD", categoria: "Periféricos", marca: "Logitech", precio: 25990, imagen: "/img/x.jpg" });
    expect(obtenerProductos().length).toBe(antes + 1);
    expect(nuevo.id).toBe(7);
    expect(obtenerProductoPorId(7).nombre).toBe("Webcam HD");
  });

  it("actualizarProducto modifica solo los campos indicados", () => {
    const actualizado = actualizarProducto(1, { precio: 599990 });
    expect(actualizado.precio).toBe(599990);
    expect(actualizado.nombre).toBe("Notebook Gamer X1");
  });

  it("eliminarProducto quita el producto y devuelve false si no existe", () => {
    expect(eliminarProducto(2)).toBe(true);
    expect(obtenerProductoPorId(2)).toBeNull();
    expect(eliminarProducto(999)).toBe(false);
  });
});
