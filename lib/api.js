// ===== Cliente REST del backend (API Gateway) =====
// Todas las llamadas al backend pasan por aquí. El gateway (puerto 8090) es
// la única puerta de entrada a los microservicios.
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8090";

// El backend usa roles en mayúscula (ADMIN / CLIENTE); la interfaz usa minúscula.
export function normalizarUsuario(u) {
  return { id: u.id, nombre: u.nombre, correo: u.correo, rol: String(u.rol || "CLIENTE").toLowerCase() };
}

// Hace una petición y siempre devuelve { ok, status, datos, error } (nunca lanza).
export async function peticion(ruta, { metodo = "GET", cuerpo, token } = {}) {
  const cabeceras = { "Content-Type": "application/json" };
  if (token) cabeceras.Authorization = `Bearer ${token}`;
  try {
    const resp = await fetch(API_URL + ruta, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
    let datos = null;
    try {
      datos = await resp.json();
    } catch {
      // La respuesta no traía JSON (por ejemplo un 204).
    }
    if (resp.ok) return { ok: true, status: resp.status, datos };
    const error = (datos && datos.mensaje) || mensajePorEstado(resp.status);
    return { ok: false, status: resp.status, datos, error };
  } catch {
    return { ok: false, status: 0, datos: null, error: "No se pudo conectar con el servidor. Verifica que el backend esté encendido." };
  }
}

function mensajePorEstado(status) {
  if (status === 401) return "Tu sesión expiró o no es válida. Inicia sesión nuevamente.";
  if (status === 403) return "No tienes permisos para realizar esta acción.";
  return "Ocurrió un error en el servidor.";
}

export async function loginApi(correo, clave) {
  const r = await peticion("/api/v1/auth/login", { metodo: "POST", cuerpo: { correo, password: clave } });
  if (!r.ok) return r;
  return { ok: true, token: r.datos.token, usuario: normalizarUsuario(r.datos.usuario) };
}

export async function registroApi({ nombre, apellidos, correo, clave }) {
  const r = await peticion("/api/v1/auth/registro", {
    metodo: "POST",
    cuerpo: { nombre: `${nombre} ${apellidos}`.trim(), correo, password: clave },
  });
  if (!r.ok) {
    // Errores de validación del backend vienen como { campo: mensaje }.
    if (r.status === 400 && r.datos && typeof r.datos === "object") {
      return { ...r, error: Object.values(r.datos).join(" ") };
    }
    return r;
  }
  return { ok: true, token: r.datos.token, usuario: normalizarUsuario(r.datos.usuario) };
}

// Solo funciona con token de ADMIN (el gateway responde 403 si no).
export async function listarUsuariosApi(token) {
  const r = await peticion("/api/v1/usuarios", { token });
  if (!r.ok) return r;
  return { ok: true, usuarios: Array.isArray(r.datos) ? r.datos.map(normalizarUsuario) : [] };
}

// Lee la fecha de expiración (exp, en segundos) del JWT. No valida la firma: eso lo hace el backend.
export function tokenExpirado(token) {
  try {
    const carga = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return !carga.exp || carga.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
