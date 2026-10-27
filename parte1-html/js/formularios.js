// ===== Validaciones simples, mismo estilo visto en clase =====

function validar_no_vacio(texto) {
    return texto !== null && texto.trim().length > 0;
}

function validar_correo(correo) {
    // validación simple: que tenga @ y un punto después
    return correo.includes("@") && correo.includes(".");
}

function validar_password(password) {
    return password.length >= 6;
}
