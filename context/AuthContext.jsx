'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registroApi, tokenExpirado } from "../lib/api";

// Contexto de sesión: guarda quién inició sesión (y su token JWT) y ofrece
// login, registro y logout contra el backend. La sesión se guarda en
// localStorage ("ts_sesion") para que no se pierda al recargar la página.
const AuthContext = createContext({
  usuario: null,
  token: null,
  listo: true,
  iniciarSesion: async () => ({ ok: false, error: "Sin proveedor de sesión." }),
  registrar: async () => ({ ok: false, error: "Sin proveedor de sesión." }),
  cerrarSesion: () => {},
});

function guardarSesion(sesion) {
  try {
    localStorage.setItem("ts_sesion", JSON.stringify(sesion));
  } catch {
    // Si el navegador no permite localStorage, la app sigue funcionando sin guardar.
  }
}

export function AuthProvider({ children, usuarioInicial = null }) {
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [token, setToken] = useState(null);
  // "listo" pasa a true cuando ya se leyó la sesión guardada (evita parpadeos).
  const [listo, setListo] = useState(false);

  // Al cargar la página: restaura la sesión guardada si el token no ha expirado.
  useEffect(() => {
    try {
      const guardada = JSON.parse(localStorage.getItem("ts_sesion"));
      if (guardada && guardada.token && !tokenExpirado(guardada.token) && !usuarioInicial) {
        setUsuario(guardada.usuario);
        setToken(guardada.token);
      } else if (guardada) {
        localStorage.removeItem("ts_sesion");
      }
    } catch {
      // Datos guardados dañados: se ignoran.
    }
    setListo(true);
  }, []);

  const abrirSesion = (r) => {
    setUsuario(r.usuario);
    setToken(r.token);
    guardarSesion({ token: r.token, usuario: r.usuario });
  };

  const valor = {
    usuario,
    token,
    listo,
    iniciarSesion: async (correo, clave) => {
      const r = await loginApi(correo, clave);
      if (r.ok) abrirSesion(r);
      return r;
    },
    registrar: async (datos) => {
      const r = await registroApi(datos);
      if (r.ok) abrirSesion(r);
      return r;
    },
    cerrarSesion: () => {
      setUsuario(null);
      setToken(null);
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
