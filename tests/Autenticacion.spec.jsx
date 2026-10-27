import { render, screen, fireEvent } from "@testing-library/react";
import FormularioLogin from "../components/FormularioLogin";
import FormularioRegistro from "../components/FormularioRegistro";
import Navbar from "../components/Navbar";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { reiniciarUsuarios } from "../data/usuarios";

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

describe("FormularioLogin", () => {
  it("muestra errores y no envía si los campos están vacíos", () => {
    const onEnviar = jasmine.createSpy("onEnviar");
    render(<FormularioLogin onEnviar={onEnviar} />);
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(screen.getByText("Ingresa tu correo.")).toBeTruthy();
    expect(onEnviar).not.toHaveBeenCalled();
  });

  it("muestra el mensaje de error cuando las credenciales son incorrectas", () => {
    const onEnviar = jasmine.createSpy("onEnviar").and.returnValue({ ok: false, error: "Correo o contraseña incorrectos." });
    render(<FormularioLogin onEnviar={onEnviar} />);
    escribir("Correo", "cliente@techstore.cl");
    escribir("Contraseña", "mala");
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(onEnviar).toHaveBeenCalledWith({ correo: "cliente@techstore.cl", clave: "mala" });
    expect(screen.getByRole("alert").textContent).toBe("Correo o contraseña incorrectos.");
  });
});

describe("FormularioRegistro", () => {
  it("muestra error si las contraseñas no coinciden y no envía", () => {
    const onEnviar = jasmine.createSpy("onEnviar");
    render(<FormularioRegistro onEnviar={onEnviar} />);
    escribir("Nombre", "Ana");
    escribir("Apellidos", "Pérez");
    escribir("Correo", "ana@correo.cl");
    escribir("Contraseña", "secreto1");
    escribir("Repetir contraseña", "distinta");
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(screen.getByText("Las contraseñas no coinciden.")).toBeTruthy();
    expect(onEnviar).not.toHaveBeenCalled();
  });

  it("envía los datos cuando el formulario es válido", () => {
    const onEnviar = jasmine.createSpy("onEnviar").and.returnValue({ ok: true });
    render(<FormularioRegistro onEnviar={onEnviar} />);
    escribir("Nombre", "Ana");
    escribir("Apellidos", "Pérez");
    escribir("Correo", "ana@correo.cl");
    escribir("Contraseña", "secreto1");
    escribir("Repetir contraseña", "secreto1");
    fireEvent.click(screen.getByRole("button", { name: "Crear cuenta" }));
    expect(onEnviar).toHaveBeenCalledTimes(1);
    expect(onEnviar.calls.mostRecent().args[0].correo).toBe("ana@correo.cl");
  });
});

// Componente auxiliar: usa el contexto para poder probar la sesión.
function PanelSesion() {
  const { usuario, iniciarSesion, cerrarSesion } = useAuth();
  return (
    <div>
      <span data-testid="estado">{usuario ? usuario.nombre : "sin sesión"}</span>
      <button onClick={() => iniciarSesion("cliente@techstore.cl", "Cliente123")}>entrar</button>
      <button onClick={cerrarSesion}>salir</button>
    </div>
  );
}

describe("AuthContext y Navbar", () => {
  beforeEach(() => {
    reiniciarUsuarios();
    localStorage.clear();
  });

  it("iniciarSesion guarda al usuario y cerrarSesion lo quita", () => {
    render(<AuthProvider><PanelSesion /></AuthProvider>);
    expect(screen.getByTestId("estado").textContent).toBe("sin sesión");
    fireEvent.click(screen.getByRole("button", { name: "entrar" }));
    expect(screen.getByTestId("estado").textContent).toBe("Cliente");
    fireEvent.click(screen.getByRole("button", { name: "salir" }));
    expect(screen.getByTestId("estado").textContent).toBe("sin sesión");
  });

  it("el Navbar muestra Iniciar sesión sin sesión y el nombre con sesión", () => {
    const { unmount } = render(<AuthProvider><Navbar /></AuthProvider>);
    expect(screen.getByText("Iniciar sesión")).toBeTruthy();
    unmount();
    render(<AuthProvider usuarioInicial={{ id: 2, nombre: "Cliente", apellidos: "Demo", correo: "c@t.cl", rol: "cliente" }}><Navbar /></AuthProvider>);
    expect(screen.getByText("Hola, Cliente")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeTruthy();
  });
});
