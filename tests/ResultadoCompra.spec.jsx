import { render, screen } from "@testing-library/react";
import ResultadoCompra from "../components/ResultadoCompra";
import { CarritoProvider } from "../context/CarritoContext";

const orden = (ok) => ({
  nro: "#20261027123",
  ok,
  datos: { nombre: "Ana", apellidos: "Pérez", correo: "ana@correo.cl", calle: "Los Aromos 123", departamento: "", region: "Valparaíso", comuna: "Quilpué", indicaciones: "" },
  items: [{ id: 3, nombre: "Teclado Mecánico", precio: 29990, cantidad: 2, stock: 5, imagen: "/t.jpg" }],
  total: 59980,
});

function renderizar(exito, ordenInicial) {
  return render(
    <CarritoProvider ordenInicial={ordenInicial}>
      <ResultadoCompra exito={exito} />
    </CarritoProvider>
  );
}

describe("ResultadoCompra", () => {
  it("muestra el número de orden y el total pagado en una compra exitosa", () => {
    renderizar(true, orden(true));
    expect(screen.getByText(/Se ha realizado la compra. nro #20261027123/)).toBeTruthy();
    expect(screen.getByTestId("total-orden").textContent).toBe("Total pagado: $59.980");
  });

  it("muestra el error y el botón para reintentar cuando el pago falla", () => {
    renderizar(false, orden(false));
    expect(screen.getByText(/No se pudo realizar el pago/)).toBeTruthy();
    expect(screen.getByText("Volver a realizar el pago").getAttribute("href")).toBe("/comprar");
  });

  it("avisa que no hay compra reciente si no existe una orden", () => {
    renderizar(true, null);
    expect(screen.getByText(/No hay información de una compra reciente/)).toBeTruthy();
  });
});
