import { render, screen } from "@testing-library/react";
import ProductList from "../components/ProductList";

const productos = [
  { id: 1, nombre: "Mouse Pro", categoria: "Periféricos", marca: "Logitech", precio: 19990, precioOferta: null, stock: 3, imagen: "/a.jpg" },
  { id: 2, nombre: "Monitor 27", categoria: "Componentes", marca: "MSI", precio: 249990, precioOferta: null, stock: 3, imagen: "/b.jpg" },
];

describe("ProductList", () => {
  it("renderiza una tarjeta por cada producto del arreglo", () => {
    render(<ProductList productos={productos} />);
    expect(screen.getAllByRole("button", { name: "Agregar al carrito" }).length).toBe(2);
    expect(screen.getByText("Mouse Pro")).toBeTruthy();
    expect(screen.getByText("Monitor 27")).toBeTruthy();
  });

  it("muestra un mensaje cuando no hay productos (renderizado condicional)", () => {
    render(<ProductList productos={[]} />);
    expect(screen.getByText("No se encontraron productos.")).toBeTruthy();
  });
});
