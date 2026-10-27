import { render, screen } from "@testing-library/react";
import {
  crearSlug,
  obtenerCategorias,
  obtenerProductosPorCategoria,
  obtenerOfertas,
  reiniciarProductos,
} from "../data/productos";
import { porcentajeDescuento } from "../lib/ofertas";
import ListaCategorias from "../components/ListaCategorias";
import ProductCard from "../components/ProductCard";

describe("categorías y ofertas (data)", () => {
  beforeEach(() => reiniciarProductos());

  it("crearSlug quita tildes, pasa a minúsculas y cambia espacios por guiones", () => {
    expect(crearSlug("Periféricos")).toBe("perifericos");
    expect(crearSlug("Tarjetas de Video")).toBe("tarjetas-de-video");
  });

  it("obtenerCategorias entrega cada categoría con su cantidad de productos", () => {
    const categorias = obtenerCategorias();
    expect(categorias.length).toBe(4);
    expect(categorias.find((c) => c.slug === "perifericos").cantidad).toBe(2);
  });

  it("obtenerProductosPorCategoria devuelve solo los productos de esa categoría", () => {
    const componentes = obtenerProductosPorCategoria("componentes");
    expect(componentes.length).toBe(2);
    expect(componentes.every((p) => p.categoria === "Componentes")).toBe(true);
    expect(obtenerProductosPorCategoria("no-existe").length).toBe(0);
  });

  it("obtenerOfertas devuelve solo los productos con precio de oferta", () => {
    const ofertas = obtenerOfertas();
    expect(ofertas.length).toBe(2);
    expect(ofertas.every((p) => p.precioOferta !== null)).toBe(true);
  });

  it("porcentajeDescuento calcula el descuento redondeado", () => {
    expect(porcentajeDescuento({ precio: 19990, precioOferta: 14990 })).toBe(25);
    expect(porcentajeDescuento({ precio: 19990, precioOferta: null })).toBe(0);
  });
});

describe("ListaCategorias", () => {
  it("muestra una tarjeta con enlace por cada categoría", () => {
    const categorias = [
      { nombre: "Periféricos", slug: "perifericos", cantidad: 2 },
      { nombre: "Notebooks", slug: "notebooks", cantidad: 1 },
    ];
    render(<ListaCategorias categorias={categorias} />);
    expect(screen.getByText("Periféricos").closest("a").getAttribute("href")).toBe("/categorias/perifericos");
    expect(screen.getByText("1 producto")).toBeTruthy();
    expect(screen.getByText("2 productos")).toBeTruthy();
  });

  it("muestra un mensaje cuando no hay categorías", () => {
    render(<ListaCategorias categorias={[]} />);
    expect(screen.getByText("No hay categorías disponibles.")).toBeTruthy();
  });
});

describe("ProductCard en oferta", () => {
  it("muestra la etiqueta con el porcentaje de descuento", () => {
    const enOferta = { id: 2, nombre: "Mouse Pro", categoria: "Periféricos", marca: "Logitech", precio: 19990, precioOferta: 14990, stock: 3, imagen: "/m.jpg" };
    render(<ProductCard producto={enOferta} />);
    expect(screen.getByText("-25%")).toBeTruthy();
  });
});
