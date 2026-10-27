import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "../components/ProductCard";

const producto = { id: 1, nombre: "Teclado Mecánico RGB", categoria: "Periféricos", marca: "SteelSeries", precio: 29990, precioOferta: null, stock: 5, imagen: "/img/teclado.jpg" };

describe("ProductCard", () => {
  it("muestra el nombre y el precio recibidos por props", () => {
    render(<ProductCard producto={producto} />);
    expect(screen.getByText("Teclado Mecánico RGB")).toBeTruthy();
    expect(screen.getByText("$29.990")).toBeTruthy();
  });

  it("muestra 'Sin stock' y deshabilita el botón cuando stock es 0 (renderizado condicional)", () => {
    render(<ProductCard producto={{ ...producto, stock: 0 }} />);
    expect(screen.getByText("Sin stock")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Agregar al carrito" }).disabled).toBe(true);
  });

  it("llama a onAgregar con el producto al hacer clic (mock con spy)", () => {
    const onAgregar = jasmine.createSpy("onAgregar");
    render(<ProductCard producto={producto} onAgregar={onAgregar} />);
    fireEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));
    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(producto);
  });
});
