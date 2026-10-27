'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import FormularioRegistro from "./FormularioRegistro";

export default function RegistroPagina() {
  const router = useRouter();
  const { usuario, registrar } = useAuth();

  if (usuario) {
    return <div className="alert alert-info">Ya tienes una sesión iniciada como {usuario.nombre}. <Link href="/">Ir al inicio</Link></div>;
  }

  const crear = (datos) => {
    const respuesta = registrar(datos);
    if (respuesta.ok) router.push("/");
    return respuesta;
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-7">
        <h1 className="h3 mb-3">Crear cuenta</h1>
        <FormularioRegistro onEnviar={crear} />
        <p className="mt-3">¿Ya tienes cuenta? <Link href="/login">Iniciar sesión</Link></p>
      </div>
    </div>
  );
}
