'use client';
import { useState } from "react";
import Campo from "./Campo";
import { validarContacto } from "../lib/validaciones";

const vacio = { nombre: "", correo: "", asunto: "", mensaje: "" };

// Formulario de contacto: valida y, si está correcto, simula el envío y muestra una confirmación.
export default function FormularioContacto({ onEnviar = () => {} }) {
  const [datos, setDatos] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));
  const clase = (c) => "form-control" + (errores[c] ? " is-invalid" : "");

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validarContacto(datos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    onEnviar(datos);
    setEnviado(true);
    setDatos(vacio);
  };

  return (
    <form onSubmit={enviar} noValidate>
      {enviado && <div className="alert alert-success" role="status">¡Gracias! Recibimos tu mensaje y te responderemos pronto.</div>}
      <div className="row">
        <div className="col-12 col-md-6">
          <Campo id="nombre" etiqueta="Nombre" error={errores.nombre}>
            <input id="nombre" name="nombre" className={clase("nombre")} value={datos.nombre} onChange={cambiar} />
          </Campo>
        </div>
        <div className="col-12 col-md-6">
          <Campo id="correo" etiqueta="Correo electrónico" error={errores.correo}>
            <input id="correo" name="correo" type="email" className={clase("correo")} value={datos.correo} onChange={cambiar} />
          </Campo>
        </div>
      </div>
      <Campo id="asunto" etiqueta="Asunto" error={errores.asunto}>
        <input id="asunto" name="asunto" className={clase("asunto")} value={datos.asunto} onChange={cambiar} />
      </Campo>
      <Campo id="mensaje" etiqueta="Mensaje" error={errores.mensaje}>
        <textarea id="mensaje" name="mensaje" rows={4} className={clase("mensaje")} value={datos.mensaje} onChange={cambiar} />
      </Campo>
      <button type="submit" className="btn btn-primary">Enviar mensaje</button>
    </form>
  );
}
