// ===== Fuente de datos simulada de usuarios =====
// OJO: solo para el proyecto académico. En un sistema real las contraseñas
// nunca se guardan en texto plano: se guardan cifradas (hash) en el backend.

const usuariosIniciales = [
  { id: 1, nombre: "Admin", apellidos: "TechStore", correo: "admin@techstore.cl", clave: "Admin123", rol: "admin" },
  { id: 2, nombre: "Cliente", apellidos: "Demo", correo: "cliente@techstore.cl", clave: "Cliente123", rol: "cliente" },
];

let usuarios = usuariosIniciales.map((u) => ({ ...u }));

// Devuelve el usuario sin la contraseña.
function sinClave(usuario) {
  const { clave, ...resto } = usuario;
  return resto;
}

function mismoCorreo(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function existeCorreo(correo) {
  return usuarios.some((u) => mismoCorreo(u.correo, correo));
}

// Devuelve el usuario si el correo y la contraseña coinciden; si no, null.
export function autenticar(correo, clave) {
  const encontrado = usuarios.find((u) => mismoCorreo(u.correo, correo) && u.clave === clave);
  return encontrado ? sinClave(encontrado) : null;
}

// Crea una cuenta de cliente. Rechaza correos que ya existen.
export function registrarUsuario({ nombre, apellidos, correo, clave }) {
  if (existeCorreo(correo)) {
    return { ok: false, error: "Ya existe una cuenta con ese correo." };
  }
  const siguienteId = usuarios.reduce((max, u) => Math.max(max, u.id), 0) + 1;
  const nuevo = { id: siguienteId, nombre: nombre.trim(), apellidos: apellidos.trim(), correo: correo.trim(), clave, rol: "cliente" };
  usuarios.push(nuevo);
  return { ok: true, usuario: sinClave(nuevo) };
}

export function obtenerUsuarios() {
  return usuarios.map(sinClave);
}

// Para guardar/restaurar los usuarios registrados en el navegador (localStorage).
export function exportarUsuarios() {
  return usuarios.map((u) => ({ ...u }));
}

export function cargarUsuarios(lista) {
  usuarios = lista.map((u) => ({ ...u }));
}

export function reiniciarUsuarios() {
  usuarios = usuariosIniciales.map((u) => ({ ...u }));
}
