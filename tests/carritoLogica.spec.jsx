import { agregarItem, quitarItem, cambiarCantidad, calcularTotal, precioFinal } from "../lib/carrito";

const mouse = { id: 2, nombre: "Mouse Pro", precio: 19990, precioOferta: 14990, stock: 2, imagen: "/m.jpg" };
const teclado = { id: 3, nombre: "Teclado", precio: 29990, precioOferta: null, stock: 5, imagen: "/t.jpg" };

describe("lib/carrito (lógica del carrito)", () => {
  it("precioFinal usa el precio de oferta cuando existe", () => {
    expect(precioFinal(mouse)).toBe(14990);
    expect(precioFinal(teclado)).toBe(29990);
  });

  it("agregarItem agrega un producto nuevo y suma cantidad si ya estaba", () => {
    let items = agregarItem([], teclado);
    expect(items.length).toBe(1);
    expect(items[0].cantidad).toBe(1);
    items = agregarItem(items, teclado);
    expect(items.length).toBe(1);
    expect(items[0].cantidad).toBe(2);
  });

  it("agregarItem no supera el stock disponible", () => {
    let items = agregarItem([], mouse);
    items = agregarItem(items, mouse);
    items = agregarItem(items, mouse); // stock = 2, el tercero se ignora
    expect(items[0].cantidad).toBe(2);
  });

  it("calcularTotal suma precio x cantidad de todos los items", () => {
    let items = agregarItem([], mouse);
    items = agregarItem(items, teclado);
    items = cambiarCantidad(items, 3, 2);
    expect(calcularTotal(items)).toBe(14990 + 29990 * 2);
  });

  it("cambiarCantidad con 0 elimina el item y quitarItem lo borra por id", () => {
    let items = agregarItem(agregarItem([], mouse), teclado);
    items = cambiarCantidad(items, 2, 0);
    expect(items.length).toBe(1);
    expect(quitarItem(items, 3).length).toBe(0);
  });
});
