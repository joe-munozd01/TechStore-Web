import { validarNoVacio, validarCorreo, validarCheckout } from "../lib/validaciones";
import { crearOrden } from "../lib/pago";

const datosValidos = { nombre: "Ana", apellidos: "Pérez", correo: "ana@correo.cl", calle: "Los Aromos 123", departamento: "", region: "Valparaíso", comuna: "Quilpué", indicaciones: "" };

describe("lib/validaciones", () => {
  it("validarNoVacio rechaza textos vacíos o solo con espacios", () => {
    expect(validarNoVacio("Ana")).toBe(true);
    expect(validarNoVacio("   ")).toBe(false);
    expect(validarNoVacio("")).toBe(false);
  });

  it("validarCorreo acepta correos con formato válido y rechaza los inválidos", () => {
    expect(validarCorreo("ana@correo.cl")).toBe(true);
    expect(validarCorreo("ana@correo")).toBe(false);
    expect(validarCorreo("ana.correo.cl")).toBe(false);
  });

  it("validarCheckout devuelve un error por cada campo obligatorio vacío", () => {
    const errores = validarCheckout({});
    expect(Object.keys(errores).sort()).toEqual(["apellidos", "calle", "comuna", "correo", "nombre", "region"]);
  });

  it("validarCheckout no devuelve errores con datos correctos", () => {
    expect(validarCheckout(datosValidos)).toEqual({});
  });
});

describe("lib/pago (crearOrden)", () => {
  const items = [{ id: 1, nombre: "Mouse", precio: 14990, cantidad: 2, stock: 5, imagen: "/m.jpg" }];

  it("calcula el total y guarda si el pago fue exitoso", () => {
    const orden = crearOrden(datosValidos, items, true);
    expect(orden.total).toBe(29980);
    expect(orden.ok).toBe(true);
  });

  it("genera un número de orden con formato #AAAAMMDD + 3 dígitos", () => {
    expect(crearOrden(datosValidos, items, false).nro).toMatch(/^#\d{8}\d{3}$/);
  });
});
