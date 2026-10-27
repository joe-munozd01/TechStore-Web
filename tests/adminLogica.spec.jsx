import { validarProducto } from "../lib/validaciones";
import { ventasTotales, ticketPromedio, unidadesPorProducto } from "../lib/reportes";
import { criticosDe } from "../lib/catalogo";
import { registrarOrden, obtenerOrdenes, reiniciarOrdenes } from "../data/ordenes";

const ordenPagada = (total, items) => ({ ok: true, total, items });

describe("validarProducto", () => {
  const valido = { nombre: "Webcam", categoria: "Periféricos", marca: "Logitech", precio: "25990", precioOferta: "", stock: "5" };

  it("acepta un producto correcto y la oferta es opcional", () => {
    expect(validarProducto(valido)).toEqual({});
  });

  it("rechaza precio 0, stock decimal y oferta mayor al precio", () => {
    const errores = validarProducto({ ...valido, precio: "0", stock: "2.5", precioOferta: "30000" });
    expect(errores.precio).toBeDefined();
    expect(errores.stock).toBeDefined();
    expect(errores.precioOferta).toBeDefined();
  });
});

describe("lib/reportes", () => {
  const ordenes = [
    ordenPagada(30000, [{ nombre: "Mouse", cantidad: 2 }]),
    ordenPagada(10000, [{ nombre: "Mouse", cantidad: 1 }, { nombre: "Teclado", cantidad: 3 }]),
    { ok: false, total: 99999, items: [{ nombre: "Monitor", cantidad: 9 }] },
  ];

  it("ventasTotales y ticketPromedio ignoran las compras rechazadas", () => {
    expect(ventasTotales(ordenes)).toBe(40000);
    expect(ticketPromedio(ordenes)).toBe(20000);
  });

  it("unidadesPorProducto ordena de mayor a menor", () => {
    const ranking = unidadesPorProducto(ordenes);
    expect(ranking[0]).toEqual({ nombre: "Mouse", unidades: 3 });
    expect(ranking[1]).toEqual({ nombre: "Teclado", unidades: 3 });
    expect(ranking.length).toBe(2);
  });
});

describe("stock crítico y órdenes (data)", () => {
  beforeEach(() => reiniciarOrdenes());

  it("criticosDe incluye los productos con stock bajo o agotados", () => {
    const lista = [{ stock: 0 }, { stock: 10 }, { stock: 11 }];
    expect(criticosDe(lista).length).toBe(2);
  });

  it("registrarOrden asigna ids consecutivos y fecha", () => {
    const a = registrarOrden({ nro: "#1", ok: true });
    const b = registrarOrden({ nro: "#2", ok: false });
    expect(a.id).toBe(1);
    expect(b.id).toBe(2);
    expect(obtenerOrdenes().length).toBe(2);
    expect(a.fecha).toBeDefined();
  });
});
