import { render, screen, fireEvent } from "@testing-library/react";
import FormularioCheckout from "../components/FormularioCheckout";

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

describe("FormularioCheckout", () => {
  it("muestra errores y NO confirma si se envía vacío", () => {
    const onConfirmar = jasmine.createSpy("onConfirmar");
    render(<FormularioCheckout total={29990} onConfirmar={onConfirmar} />);
    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
    expect(screen.getByText("Ingresa tu nombre.")).toBeTruthy();
    expect(screen.getByText("Selecciona una región.")).toBeTruthy();
    expect(onConfirmar).not.toHaveBeenCalled();
  });

  it("las comunas disponibles dependen de la región elegida (estado)", () => {
    render(<FormularioCheckout total={1000} onConfirmar={() => {}} />);
    escribir("Región", "Valparaíso");
    const opciones = Array.from(screen.getByLabelText("Comuna").options).map((o) => o.value);
    expect(opciones).toContain("Viña del Mar");
    expect(opciones).not.toContain("Santiago");
  });

  it("confirma con los datos ingresados cuando el formulario es válido", () => {
    const onConfirmar = jasmine.createSpy("onConfirmar");
    render(<FormularioCheckout total={29990} onConfirmar={onConfirmar} />);
    escribir("Nombre", "Ana");
    escribir("Apellidos", "Pérez");
    escribir("Correo", "ana@correo.cl");
    escribir("Calle y número", "Los Aromos 123");
    escribir("Región", "Valparaíso");
    escribir("Comuna", "Quilpué");
    fireEvent.click(screen.getByRole("button", { name: /Pagar ahora/ }));
    expect(onConfirmar).toHaveBeenCalledTimes(1);
    expect(onConfirmar.calls.mostRecent().args[0].comuna).toBe("Quilpué");
    expect(onConfirmar.calls.mostRecent().args[1]).toBe(false);
  });
});
