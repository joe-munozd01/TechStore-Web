import { render, screen, fireEvent } from "@testing-library/react";
import ListaBlog from "../components/ListaBlog";
import FormularioContacto from "../components/FormularioContacto";
import { obtenerArticulos, obtenerArticulo } from "../data/blog";
import { validarContacto } from "../lib/validaciones";

describe("blog", () => {
  it("obtenerArticulo encuentra un artículo por su slug y devuelve null si no existe", () => {
    expect(obtenerArticulo("como-elegir-un-notebook").titulo).toContain("notebook");
    expect(obtenerArticulo("no-existe")).toBeNull();
  });

  it("ListaBlog muestra un enlace de lectura por cada artículo", () => {
    render(<ListaBlog articulos={obtenerArticulos()} />);
    const enlaces = screen.getAllByText("Leer artículo");
    expect(enlaces.length).toBe(2);
    expect(enlaces[0].getAttribute("href")).toBe("/blog/como-elegir-un-notebook");
  });
});

describe("contacto", () => {
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

  it("validarContacto exige todos los campos y un mensaje de al menos 10 caracteres", () => {
    expect(Object.keys(validarContacto({})).sort()).toEqual(["asunto", "correo", "mensaje", "nombre"]);
    expect(validarContacto({ nombre: "Ana", correo: "a@b.cl", asunto: "Pedido", mensaje: "corto" }).mensaje).toBeDefined();
  });

  it("FormularioContacto muestra errores si se envía vacío", () => {
    const onEnviar = jasmine.createSpy("onEnviar");
    render(<FormularioContacto onEnviar={onEnviar} />);
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(screen.getByText("Ingresa tu nombre.")).toBeTruthy();
    expect(onEnviar).not.toHaveBeenCalled();
  });

  it("FormularioContacto envía, confirma y limpia el formulario", () => {
    const onEnviar = jasmine.createSpy("onEnviar");
    render(<FormularioContacto onEnviar={onEnviar} />);
    escribir("Nombre", "Ana");
    escribir("Correo electrónico", "ana@correo.cl");
    escribir("Asunto", "Consulta por mi pedido");
    escribir("Mensaje", "Hola, quiero saber el estado de mi pedido.");
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(onEnviar).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("status").textContent).toContain("Recibimos tu mensaje");
    expect(screen.getByLabelText("Nombre").value).toBe("");
  });
});
