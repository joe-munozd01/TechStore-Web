import { autenticar, registrarUsuario, existeCorreo, reiniciarUsuarios } from "../data/usuarios";
import { validarLogin, validarRegistro } from "../lib/validaciones";

describe("data/usuarios", () => {
  beforeEach(() => reiniciarUsuarios());

  it("autenticar devuelve el usuario sin contraseña si las credenciales son correctas", () => {
    const usuario = autenticar("cliente@techstore.cl", "Cliente123");
    expect(usuario.nombre).toBe("Cliente");
    expect(usuario.clave).toBeUndefined();
  });

  it("autenticar devuelve null con contraseña o correo incorrectos", () => {
    expect(autenticar("cliente@techstore.cl", "mala")).toBeNull();
    expect(autenticar("nadie@techstore.cl", "Cliente123")).toBeNull();
  });

  it("registrarUsuario crea una cuenta de cliente y rechaza correos repetidos", () => {
    const datos = { nombre: "Ana", apellidos: "Pérez", correo: "ana@correo.cl", clave: "secreto1" };
    const resultado = registrarUsuario(datos);
    expect(resultado.ok).toBe(true);
    expect(resultado.usuario.rol).toBe("cliente");
    expect(existeCorreo("ANA@correo.cl")).toBe(true);
    expect(registrarUsuario(datos).ok).toBe(false);
  });
});

describe("validaciones de login y registro", () => {
  it("validarLogin exige correo válido y contraseña", () => {
    expect(Object.keys(validarLogin({})).sort()).toEqual(["clave", "correo"]);
    expect(validarLogin({ correo: "a@b.cl", clave: "x" })).toEqual({});
  });

  it("validarRegistro rechaza contraseñas cortas o que no coinciden", () => {
    const base = { nombre: "Ana", apellidos: "Pérez", correo: "ana@correo.cl" };
    expect(validarRegistro({ ...base, clave: "123", confirmar: "123" }).clave).toBeDefined();
    expect(validarRegistro({ ...base, clave: "secreto1", confirmar: "otro" }).confirmar).toBeDefined();
    expect(validarRegistro({ ...base, clave: "secreto1", confirmar: "secreto1" })).toEqual({});
  });
});
