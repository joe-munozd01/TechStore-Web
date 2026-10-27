// Ayudas para guardar y leer datos en localStorage sin que la app se caiga
// si el navegador no lo permite o el contenido está dañado.
export function guardarJSON(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // sin almacenamiento: la app sigue funcionando sin guardar
  }
}

export function leerJSON(clave, defecto = null) {
  try {
    const texto = localStorage.getItem(clave);
    return texto ? JSON.parse(texto) : defecto;
  } catch {
    return defecto;
  }
}
