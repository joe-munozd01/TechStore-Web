'use client';
import { useState } from "react";
import Campo from "../Campo";
import { validarProducto } from "../../lib/validaciones";

const vacio = { nombre: "", categoria: "", marca: "", descripcion: "", precio: "", precioOferta: "", stock: "", imagen: "" };

// Formulario para crear o editar un producto. Los campos numéricos se escriben
// como texto, se validan y luego se envían como números a onGuardar.
export default function FormularioProducto({ productoInicial, onGuardar }) {
  const [datos, setDatos] = useState(() => {
    if (!productoInicial) return vacio;
    return { ...vacio, ...productoInicial, precioOferta: productoInicial.precioOferta ?? "" };
  });
  const [errores, setErrores] = useState({});

  const cambiar = (e) => setDatos((d) => ({ ...d, [e.target.name]: e.target.value }));
  const clase = (c) => "form-control" + (errores[c] ? " is-invalid" : "");

  const enviar = (e) => {
    e.preventDefault();
    const nuevos = validarProducto(datos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;
    onGuardar({
      nombre: datos.nombre.trim(),
      categoria: datos.categoria.trim(),
      marca: datos.marca.trim(),
      descripcion: datos.descripcion.trim(),
      precio: Number(datos.precio),
      precioOferta: datos.precioOferta === "" ? null : Number(datos.precioOferta),
      stock: Number(datos.stock),
      imagen: datos.imagen.trim() || "/img/logo.jpg",
    });
  };

  const campo = (id, etiqueta, tipo = "text") => (
    <Campo id={id} etiqueta={etiqueta} error={errores[id]}>
      <input id={id} name={id} type={tipo} className={clase(id)} value={datos[id]} onChange={cambiar} />
    </Campo>
  );

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row">
        <div className="col-12 col-md-6">{campo("nombre", "Nombre")}</div>
        <div className="col-12 col-md-3">{campo("categoria", "Categoría")}</div>
        <div className="col-12 col-md-3">{campo("marca", "Marca")}</div>
      </div>
      <Campo id="descripcion" etiqueta="Descripción">
        <textarea id="descripcion" name="descripcion" rows={2} className="form-control" value={datos.descripcion} onChange={cambiar} />
      </Campo>
      <div className="row">
        <div className="col-12 col-md-4">{campo("precio", "Precio", "number")}</div>
        <div className="col-12 col-md-4">{campo("precioOferta", "Precio de oferta (opcional)", "number")}</div>
        <div className="col-12 col-md-4">{campo("stock", "Stock", "number")}</div>
      </div>
      {campo("imagen", "Imagen (ruta, ej: /img/mouse-pro.jpg)")}
      <button type="submit" className="btn btn-primary">Guardar producto</button>
    </form>
  );
}
