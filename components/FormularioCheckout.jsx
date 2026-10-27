'use client';
import { useState } from "react";
import { regiones, comunasDe } from "../data/zonas";
import { validarCheckout } from "../lib/validaciones";
import { formatearPrecio } from "./ProductCard";

const vacio = { nombre: "", apellidos: "", correo: "", calle: "", departamento: "", region: "", comuna: "", indicaciones: "" };

// Un campo de formulario con su etiqueta y su mensaje de error (clases de Bootstrap).
function Campo({ id, etiqueta, error, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      {children}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}

// Formulario de datos del cliente y dirección de entrega.
// Valida al enviar; si todo está bien llama a onConfirmar(datos, simularError).
export default function FormularioCheckout({ total, datosIniciales, onConfirmar }) {
  const [datos, setDatos] = useState({ ...vacio, ...datosIniciales });
  const [errores, setErrores] = useState({});
  const [simularError, setSimularError] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;
    // Si cambia la región, la comuna anterior ya no corresponde.
    setDatos((d) => ({ ...d, [name]: value, ...(name === "region" ? { comuna: "" } : {}) }));
  };

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validarCheckout(datos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length === 0) onConfirmar(datos, simularError);
  };

  const clase = (campo) => "form-control" + (errores[campo] ? " is-invalid" : "");
  const claseSelect = (campo) => "form-select" + (errores[campo] ? " is-invalid" : "");

  return (
    <form onSubmit={enviar} noValidate>
      <h2 className="h5">Información del cliente</h2>
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

      <h2 className="h5 mt-3">Dirección de entrega</h2>
      <div className="row">
        <div className="col-12 col-md-8">
          <Campo id="calle" etiqueta="Calle y número" error={errores.calle}>
            <input id="calle" name="calle" className={clase("calle")} value={datos.calle} onChange={cambiar} />
          </Campo>
        </div>
        <div className="col-12 col-md-4">
          <Campo id="departamento" etiqueta="Departamento (opcional)">
            <input id="departamento" name="departamento" className="form-control" value={datos.departamento} onChange={cambiar} />
          </Campo>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-6">
          <Campo id="region" etiqueta="Región" error={errores.region}>
            <select id="region" name="region" className={claseSelect("region")} value={datos.region} onChange={cambiar}>
              <option value="">Selecciona una región</option>
              {regiones.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
            </select>
          </Campo>
        </div>
        <div className="col-12 col-md-6">
          <Campo id="comuna" etiqueta="Comuna" error={errores.comuna}>
            <select id="comuna" name="comuna" className={claseSelect("comuna")} value={datos.comuna} onChange={cambiar}>
              <option value="">Selecciona una comuna</option>
              {comunasDe(datos.region).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Campo>
        </div>
      </div>
      <Campo id="indicaciones" etiqueta="Indicaciones para la entrega (opcional)">
        <textarea id="indicaciones" name="indicaciones" rows={2} className="form-control" value={datos.indicaciones} onChange={cambiar} />
      </Campo>

      <div className="form-check mb-3">
        <input id="simular" type="checkbox" className="form-check-input" checked={simularError} onChange={(e) => setSimularError(e.target.checked)} />
        <label htmlFor="simular" className="form-check-label text-muted">Simular error en el pago (solo para la demostración)</label>
      </div>

      <button type="submit" className="btn btn-success">Pagar ahora {formatearPrecio(total)}</button>
    </form>
  );
}
