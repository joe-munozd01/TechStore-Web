import { render, screen, fireEvent } from "@testing-library/react";
import CarritoVista from "../components/CarritoVista";
import { CarritoProvider } from "../context/CarritoContext";

const inicial = [
  { id: 3, nombre: "Teclado Mecánico", imagen: "/t.jpg", precio: 29990, stock: 5, cantidad: 1 },
];

function renderizar(items) {
  return render(
    <CarritoProvider inicial={items}>
      <CarritoVista />
    </CarritoProvider>
  );
}

describe("CarritoVista", () => {
  it("muestra un mensaje cuando el carrito está vacío", () => {
    renderizar([]);
    expect(screen.getByText(/Tu carrito está vacío/)).toBeTruthy();
  });

  it("muestra los productos y el total", () => {
    renderizar(inicial);
    expect(screen.getByText("Teclado Mecánico")).toBeTruthy();
    expect(screen.getByTestId("total").textContent).toBe("$29.990");
  });

  it("aumenta la cantidad y recalcula el total al hacer clic en +", () => {
    renderizar(inicial);
    fireEvent.click(screen.getByRole("button", { name: "Aumentar Teclado Mecánico" }));
    expect(screen.getByTestId("cantidad-3").textContent).toBe("2");
    expect(screen.getByTestId("total").textContent).toBe("$59.980");
  });

  it("elimina el producto al hacer clic en Eliminar", () => {
    renderizar(inicial);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(screen.getByText(/Tu carrito está vacío/)).toBeTruthy();
  });
});
