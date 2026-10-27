import { render, screen, fireEvent } from "@testing-library/react";
import Catalogo from "../components/Catalogo";

const productos = [
  { id: 1, nombre: "Mouse Pro", categoria: "Periféricos", marca: "Logitech", precio: 19990, precioOferta: null, stock: 3, imagen: "/a.jpg" },
  { id: 2, nombre: "Monitor 27", categoria: "Componentes", marca: "MSI", precio: 249990, precioOferta: null, stock: 3, imagen: "/b.jpg" },
];

describe("Catalogo (estado del filtro)", () => {
  it("filtra la lista al escribir en el buscador", () => {
    render(<Catalogo productos={productos} />);
    expect(screen.getAllByRole("button", { name: "Agregar al carrito" }).length).toBe(2);

    fireEvent.change(screen.getByLabelText("Buscar producto"), { target: { value: "mouse" } });

    expect(screen.getAllByRole("button", { name: "Agregar al carrito" }).length).toBe(1);
    expect(screen.queryByText("Monitor 27")).toBeNull();
  });
});
