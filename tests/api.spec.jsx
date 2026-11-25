import { loginApi, registroApi, listarUsuariosApi, peticion, tokenExpirado, normalizarUsuario } from "../lib/api";

// jsdom no trae fetch: se crea uno vacío para poder espiarlo (spyOn) en cada prueba.
if (!window.fetch) window.fetch = () => Promise.reject(new Error("fetch no simulado"));

function respuesta(status, cuerpo) {
  return Promise.resolve({ ok: status >= 200 && status < 300, status, json: () => Promise.resolve(cuerpo) });
}

describe("lib/api (cliente REST del API Gateway)", () => {
  it("loginApi envía correo y password y normaliza el rol", async () => {
    spyOn(window, "fetch").and.returnValue(respuesta(200, { token: "t", usuario: { id: 1, nombre: "Admin", correo: "admin@techstore.cl", rol: "ADMIN" } }));
    const r = await loginApi("admin@techstore.cl", "Admin123");
    const [url, opciones] = window.fetch.calls.mostRecent().args;
    expect(url).toBe("http://localhost:8090/api/v1/auth/login");
    expect(opciones.method).toBe("POST");
    expect(JSON.parse(opciones.body)).toEqual({ correo: "admin@techstore.cl", password: "Admin123" });
    expect(r.ok).toBeTrue();
    expect(r.usuario.rol).toBe("admin");
  });

  it("loginApi devuelve el mensaje del backend cuando responde 401", async () => {
    spyOn(window, "fetch").and.returnValue(respuesta(401, { mensaje: "Correo o contraseña incorrectos" }));
    const r = await loginApi("x@x.cl", "mala");
    expect(r.ok).toBeFalse();
    expect(r.error).toBe("Correo o contraseña incorrectos");
  });

  it("registroApi une nombre y apellidos y muestra errores de validación", async () => {
    spyOn(window, "fetch").and.returnValue(respuesta(400, { password: "Mínimo 6 caracteres" }));
    const r = await registroApi({ nombre: "Ana", apellidos: "Pérez", correo: "ana@correo.cl", clave: "123" });
    expect(JSON.parse(window.fetch.calls.mostRecent().args[1].body).nombre).toBe("Ana Pérez");
    expect(r.error).toBe("Mínimo 6 caracteres");
  });

  it("listarUsuariosApi envía el JWT en la cabecera Authorization", async () => {
    spyOn(window, "fetch").and.returnValue(respuesta(200, [{ id: 1, nombre: "A", correo: "a@t.cl", rol: "ADMIN" }]));
    const r = await listarUsuariosApi("mi-token");
    expect(window.fetch.calls.mostRecent().args[1].headers.Authorization).toBe("Bearer mi-token");
    expect(r.usuarios[0].rol).toBe("admin");
  });

  it("un 403 del gateway se traduce a un mensaje de permisos", async () => {
    spyOn(window, "fetch").and.returnValue(respuesta(403, null));
    const r = await listarUsuariosApi("token-cliente");
    expect(r.ok).toBeFalse();
    expect(r.error).toContain("permisos");
  });

  it("si el backend está apagado devuelve un error de conexión sin lanzar", async () => {
    spyOn(window, "fetch").and.returnValue(Promise.reject(new TypeError("Failed to fetch")));
    const r = await peticion("/api/v1/productos");
    expect(r.ok).toBeFalse();
    expect(r.status).toBe(0);
    expect(r.error).toContain("No se pudo conectar");
  });

  it("tokenExpirado detecta tokens vencidos, vigentes y mal formados", () => {
    const hacer = (exp) => `a.${btoa(JSON.stringify({ exp }))}.b`;
    expect(tokenExpirado(hacer(Math.floor(Date.now() / 1000) + 60))).toBeFalse();
    expect(tokenExpirado(hacer(Math.floor(Date.now() / 1000) - 60))).toBeTrue();
    expect(tokenExpirado("basura")).toBeTrue();
  });

  it("normalizarUsuario usa CLIENTE por defecto", () => {
    expect(normalizarUsuario({ id: 3, nombre: "X", correo: "x@x.cl" }).rol).toBe("cliente");
  });
});
