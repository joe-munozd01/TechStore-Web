// ===== Validaciones del formulario de compra (lógica pura, fácil de probar) =====

export function validarNoVacio(texto) {
  return typeof texto === "string" && texto.trim().length > 0;
}

export function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo || "");
}

// Devuelve un objeto con un mensaje por cada campo inválido ({} si todo está bien).
export function validarCheckout(datos) {
  const errores = {};
  if (!validarNoVacio(datos.nombre)) errores.nombre = "Ingresa tu nombre.";
  if (!validarNoVacio(datos.apellidos)) errores.apellidos = "Ingresa tus apellidos.";
  if (!validarNoVacio(datos.correo)) errores.correo = "Ingresa tu correo.";
  else if (!validarCorreo(datos.correo)) errores.correo = "El correo no tiene un formato válido.";
  if (!validarNoVacio(datos.calle)) errores.calle = "Ingresa la calle y el número.";
  if (!validarNoVacio(datos.region)) errores.region = "Selecciona una región.";
  if (!validarNoVacio(datos.comuna)) errores.comuna = "Selecciona una comuna.";
  return errores;
}

// ===== Login y registro =====

export function validarLogin(datos) {
  const errores = {};
  if (!validarNoVacio(datos.correo)) errores.correo = "Ingresa tu correo.";
  else if (!validarCorreo(datos.correo)) errores.correo = "El correo no tiene un formato válido.";
  if (!validarNoVacio(datos.clave)) errores.clave = "Ingresa tu contraseña.";
  return errores;
}

export function validarRegistro(datos) {
  const errores = {};
  if (!validarNoVacio(datos.nombre)) errores.nombre = "Ingresa tu nombre.";
  if (!validarNoVacio(datos.apellidos)) errores.apellidos = "Ingresa tus apellidos.";
  if (!validarNoVacio(datos.correo)) errores.correo = "Ingresa tu correo.";
  else if (!validarCorreo(datos.correo)) errores.correo = "El correo no tiene un formato válido.";
  if (!datos.clave || datos.clave.length < 6) errores.clave = "La contraseña debe tener al menos 6 caracteres.";
  if (datos.confirmar !== datos.clave) errores.confirmar = "Las contraseñas no coinciden.";
  return errores;
}
