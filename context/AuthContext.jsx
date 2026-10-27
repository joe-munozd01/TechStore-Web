'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { autenticar, registrarUsuario, exportarUsuarios, cargarUsuarios } from "../data/usuarios";

// Contexto de sesión: guarda quién inició sesión y ofrece login, registro y logout.
// Los usuarios registrados y la sesión se guardan en localStorage para que
// no se pierdan al recargar la página.
const AuthContext = createContext({
  usuario: null,
  listo: true,
  iniciarSesion: () => ({ ok: false, error: "Sin proveedor de sesión." }),
  registrar: () => ({ ok: false, error: "Sin proveedor de sesión." }),
  cerrarSesion: () => {},
});

function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // Si el navegador no permite localStorage, la app sigue funcionando sin guardar.
  }
}

export function AuthProvider({ children, usuarioInicial = null }) {
  const [usuario, setUsuario] = useState(usuarioInicial);
  // "listo" pasa a true cuando ya se leyó la sesión guardada (evita parpadeos).
  const [listo, setListo] = useState(false);

  // Al cargar la página: restaura usuarios registrados y la sesión guardada.
  useEffect(() => {
    try {
      const usuariosGuardados = localStorage.getItem("ts_usuarios");
      if (usuariosGuardados) cargarUsuarios(JSON.parse(usuariosGuardados));
      const sesion = localStorage.getItem("ts_sesion");
      if (sesion && !usuarioInicial) setUsuario(JSON.parse(sesion));
    } catch {
      // Datos guardados dañados: se ignoran.
    }
    setListo(true);
  }, []);

  const valor = {
    usuario,
    listo,
    iniciarSesion: (correo, clave) => {
      const encontrado = autenticar(correo, clave);
      if (!encontrado) return { ok: false, error: "Correo o contraseña incorrectos." };
      setUsuario(encontrado);
      guardar("ts_sesion", encontrado);
      return { ok: true, usuario: encontrado };
    },
    registrar: (datos) => {
      const resultado = registrarUsuario(datos);
      if (resultado.ok) {
        guardar("ts_usuarios", exportarUsuarios());
        setUsuario(resultado.usuario);
        guardar("ts_sesion", resultado.usuario);
      }
      return resultado;
    },
    cerrarSesion: () => {
      setUsuario(null);
      try {
        localStorage.removeItem("ts_sesion");
      } catch {
        // nada que hacer
      }
    },
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
