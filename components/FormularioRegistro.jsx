'use client';
import { useState } from "react";
import Campo from "./Campo";
import { validarRegistro } from "../lib/validaciones";

const vacio = { nombre: "", apellidos: "", correo: "", clave: "", confirmar: "" };

// Formulario de registro. Valida los campos y luego llama a
// onEnviar(datos), que responde { ok, error }.
export default function FormularioRegistro({ onEnviar }) {
  const [datos, setDatos] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));
  const clase = (campo) => "form-control" + (errores[campo] ? " is-invalid" : "");

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validarRegistro(datos);
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length > 0) return;
    const respuesta = onEnviar(datos);
    if (respuesta && !respuesta.ok) setErrorGeneral(respuesta.error);
  };

  return (
    <form onSubmit={enviar} noValidate>
      {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}
      <div className="row">
        <div className="col-12 col-md-6">
          <Campo id="nombre" etiqueta="Nombre" error={errores.nombre}>
            <input id="nombre" name="nombre" className={clase("nombre")} value={datos.nombre} onChange={cambiar} />
          </Campo>
        </div>
        <div className="col-12 col-md-6">
          <Campo id="apellidos" etiqueta="Apellidos" error={errores.apellidos}>
            <input id="apellidos" name="apellidos" className={clase("apellidos")} value={datos.apellidos} onChange={cambiar} />
          </Campo>
        </div>
      </div>
      <Campo id="correo" etiqueta="Correo" error={errores.correo}>
        <input id="correo" name="correo" type="email" className={clase("correo")} value={datos.correo} onChange={cambiar} />
      </Campo>
      <div className="row">
        <div className="col-12 col-md-6">
          <Campo id="clave" etiqueta="Contraseña" error={errores.clave}>
            <input id="clave" name="clave" type="password" className={clase("clave")} value={datos.clave} onChange={cambiar} />
          </Campo>
        </div>
        <div className="col-12 col-md-6">
          <Campo id="confirmar" etiqueta="Repetir contraseña" error={errores.confirmar}>
            <input id="confirmar" name="confirmar" type="password" className={clase("confirmar")} value={datos.confirmar} onChange={cambiar} />
          </Campo>
        </div>
      </div>
      <button type="submit" className="btn btn-primary w-100">Crear cuenta</button>
    </form>
  );
}
