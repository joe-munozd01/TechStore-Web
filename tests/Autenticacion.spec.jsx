import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import FormularioLogin from "../components/FormularioLogin";
import FormularioRegistro from "../components/FormularioRegistro";
import Navbar from "../components/Navbar";
import { AuthProvider, useAuth } from "../context/AuthContext";

// jsdom no trae fetch: se crea uno vacío para poder espiarlo (spyOn) en cada prueba.
if (!window.fetch) window.fetch = () => Promise.reject(new Error("fetch no simulado"));

// jsdom tampoco trae MessageChannel, que React usa para esperar tareas asíncronas dentro de act().
if (!window.MessageChannel) {
  window.MessageChannel = class {
    constructor() {
      this.port1 = { onmessage: null, close() {} };
      this.port2 = { postMessage: (data) => setTimeout(() => this.port1.onmessage && this.port1.onmessage({ data }), 0), close() {} };
    }
  };
}

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

  it("muestra el mensaje de error cuando las credenciales son incorrectas", async () => {
    const onEnviar = jasmine.createSpy("onEnviar").and.returnValue(Promise.resolve({ ok: false, error: "Correo o contraseña incorrectos." }));
    render(<FormularioLogin onEnviar={onEnviar} />);
    escribir("Correo", "cliente@techstore.cl");
    escribir("Contraseña", "mala");
    fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
    expect(onEnviar).toHaveBeenCalledWith({ correo: "cliente@techstore.cl", clave: "mala" });
    expect((await screen.findByRole("alert")).textContent).toBe("Correo o contraseña incorrectos.");
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

// Respuesta falsa de fetch (simula al API Gateway).
function respuesta(status, cuerpo) {
  return Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(cuerpo) });
}

// JWT de prueba con expiración en 1 hora (la firma no se valida en el frontend).
function tokenFalso(segundos = 3600) {
  const carga = btoa(JSON.stringify({ sub: "cliente@techstore.cl", rol: "CLIENTE", exp: Math.floor(Date.now() / 1000) + segundos }));
  return `cabecera.${carga}.firma`;
}

// Componente auxiliar: usa el contexto para poder probar la sesión.
function PanelSesion() {
  const { usuario, iniciarSesion, cerrarSesion } = useAuth();
  return (
    <div>
      <span data-testid="estado">{usuario ? `${usuario.nombre} (${usuario.rol})` : "sin sesión"}</span>
      <button onClick={() => iniciarSesion("cliente@techstore.cl", "Cliente123")}>entrar</button>
      <button onClick={cerrarSesion}>salir</button>
    </div>
  );
}

describe("AuthContext (conectado a la API) y Navbar", () => {
  beforeEach(() => localStorage.clear());

  it("iniciarSesion llama al backend, guarda token y usuario, y cerrarSesion los borra", async () => {
    const token = tokenFalso();
    spyOn(window, "fetch").and.returnValue(respuesta(200, { token, usuario: { id: 2, nombre: "Cliente Demo", correo: "cliente@techstore.cl", rol: "CLIENTE" } }));
    render(<AuthProvider><PanelSesion /></AuthProvider>);
    expect(screen.getByTestId("estado").textContent).toBe("sin sesión");

    // act espera a que termine la llamada asíncrona al backend y se actualice el estado.
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "entrar" }));
    });
    expect(screen.getByTestId("estado").textContent).toBe("Cliente Demo (cliente)");
    expect(window.fetch.calls.mostRecent().args[0]).toContain("/api/v1/auth/login");
    expect(JSON.parse(localStorage.getItem("ts_sesion")).token).toBe(token);

    fireEvent.click(screen.getByRole("button", { name: "salir" }));
    expect(screen.getByTestId("estado").textContent).toBe("sin sesión");
    expect(localStorage.getItem("ts_sesion")).toBeNull();
  });

  it("restaura la sesión guardada al recargar si el token no expiró", async () => {
    localStorage.setItem("ts_sesion", JSON.stringify({ token: tokenFalso(), usuario: { id: 1, nombre: "Admin", correo: "a@t.cl", rol: "admin" } }));
    render(<AuthProvider><PanelSesion /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId("estado").textContent).toBe("Admin (admin)"));
  });

  it("descarta la sesión guardada si el token expiró", async () => {
    localStorage.setItem("ts_sesion", JSON.stringify({ token: tokenFalso(-10), usuario: { id: 1, nombre: "Admin", correo: "a@t.cl", rol: "admin" } }));
    render(<AuthProvider><PanelSesion /></AuthProvider>);
    await waitFor(() => expect(localStorage.getItem("ts_sesion")).toBeNull());
    expect(screen.getByTestId("estado").textContent).toBe("sin sesión");
  });

  it("el Navbar muestra Iniciar sesión sin sesión y el nombre con sesión", () => {
    const { unmount } = render(<AuthProvider><Navbar /></AuthProvider>);
    expect(screen.getByText("Iniciar sesión")).toBeTruthy();
    unmount();
    render(<AuthProvider usuarioInicial={{ id: 2, nombre: "Cliente", correo: "c@t.cl", rol: "cliente" }}><Navbar /></AuthProvider>);
    expect(screen.getByText("Hola, Cliente")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeTruthy();
  });
});
