'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import FormularioLogin from "./FormularioLogin";

export default function LoginPagina() {
  const router = useRouter();
  const { usuario, iniciarSesion } = useAuth();

  if (usuario) {
    return <div className="alert alert-info">Ya iniciaste sesión como {usuario.nombre}. <Link href="/">Ir al inicio</Link></div>;
  }

  const entrar = ({ correo, clave }) => {
    const respuesta = iniciarSesion(correo, clave);
    if (respuesta.ok) router.push(respuesta.usuario.rol === "admin" ? "/admin" : "/");
    return respuesta;
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <h1 className="h3 mb-3">Iniciar sesión</h1>
        <FormularioLogin onEnviar={entrar} />
        <p className="mt-3 mb-1">¿No tienes cuenta? <Link href="/registro">Crear cuenta</Link></p>
        <p className="text-muted small">Cuenta de prueba: cliente@techstore.cl / Cliente123</p>
      </div>
    </div>
  );
}
