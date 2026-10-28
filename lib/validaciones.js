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

// ===== Producto (panel de administración) =====
// Los campos numéricos llegan como texto desde el formulario.
export function validarProducto(datos) {
  const errores = {};
  if (!validarNoVacio(datos.nombre)) errores.nombre = "Ingresa el nombre del producto.";
  if (!validarNoVacio(datos.categoria)) errores.categoria = "Ingresa la categoría.";
  if (!validarNoVacio(datos.marca)) errores.marca = "Ingresa la marca.";
  const precio = Number(datos.precio);
  if (datos.precio === "" || !(precio > 0)) errores.precio = "El precio debe ser mayor a 0.";
  if (datos.precioOferta !== "" && datos.precioOferta !== null && datos.precioOferta !== undefined) {
    const oferta = Number(datos.precioOferta);
    if (!(oferta > 0 && oferta < precio)) errores.precioOferta = "La oferta debe ser mayor a 0 y menor que el precio.";
  }
  const stock = Number(datos.stock);
  if (datos.stock === "" || !Number.isInteger(stock) || stock < 0) errores.stock = "El stock debe ser un número entero desde 0.";
  return errores;
}

// ===== Formulario de contacto =====
export function validarContacto(datos) {
  const errores = {};
  if (!validarNoVacio(datos.nombre)) errores.nombre = "Ingresa tu nombre.";
  if (!validarNoVacio(datos.correo)) errores.correo = "Ingresa tu correo.";
  else if (!validarCorreo(datos.correo)) errores.correo = "El correo no tiene un formato válido.";
  if (!validarNoVacio(datos.asunto)) errores.asunto = "Ingresa el asunto.";
  if (!validarNoVacio(datos.mensaje)) errores.mensaje = "Escribe tu mensaje.";
  else if (datos.mensaje.trim().length < 10) errores.mensaje = "El mensaje debe tener al menos 10 caracteres.";
  return errores;
}
