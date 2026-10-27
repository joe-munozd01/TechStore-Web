'use client';
import { useState } from "react";
import Campo from "./Campo";
import { validarLogin } from "../lib/validaciones";

// Formulario de inicio de sesión. Valida los campos y luego llama a
// onEnviar({ correo, clave }), que responde { ok, error }.
export default function FormularioLogin({ onEnviar }) {
  const [datos, setDatos] = useState({ correo: "", clave: "" });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validarLogin(datos);
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length > 0) return;
    const respuesta = onEnviar(datos);
    if (respuesta && !respuesta.ok) setErrorGeneral(respuesta.error);
  };

  return (
    <form onSubmit={enviar} noValidate>
      {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}
      <Campo id="correo" etiqueta="Correo" error={errores.correo}>
        <input id="correo" name="correo" type="email" className={"form-control" + (errores.correo ? " is-invalid" : "")} value={datos.correo} onChange={cambiar} />
      </Campo>
      <Campo id="clave" etiqueta="Contraseña" error={errores.clave}>
        <input id="clave" name="clave" type="password" className={"form-control" + (errores.clave ? " is-invalid" : "")} value={datos.clave} onChange={cambiar} />
      </Campo>
      <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
    </form>
  );
}
