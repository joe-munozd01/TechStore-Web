'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductos } from "../../context/ProductosContext";
import { criticosDe } from "../../lib/catalogo";
import { formatearPrecio } from "../ProductCard";
import FormularioProducto from "./FormularioProducto";

// Tabla de productos con acciones. Si "soloCriticos" es true, muestra solo los de poco stock.
export function AdminProductos({ soloCriticos = false }) {
  const { productos, eliminar } = useProductos();
  const lista = soloCriticos ? criticosDe(productos) : productos;

  const borrar = (producto) => {
    if (window.confirm("¿Eliminar el producto " + producto.nombre + "?")) eliminar(producto.id);
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h1 className="h3 mb-0">{soloCriticos ? "Productos con stock crítico" : "Productos"}</h1>
        <div className="d-flex gap-2">
          {soloCriticos ? (
            <Link href="/admin/productos" className="btn btn-outline-secondary">Ver todos</Link>
          ) : (
            <Link href="/admin/productos/criticos" className="btn btn-outline-warning">Stock crítico</Link>
          )}
          <Link href="/admin/productos/nuevo" className="btn btn-primary">Nuevo producto</Link>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped align-middle bg-white">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Oferta</th><th>Stock</th><th></th></tr>
          </thead>
          <tbody>
            {lista.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{formatearPrecio(p.precio)}</td>
                <td>{p.precioOferta ? formatearPrecio(p.precioOferta) : "-"}</td>
                <td>{p.stock === 0 ? <span className="badge text-bg-danger">Agotado</span> : p.stock}</td>
                <td className="text-nowrap">
                  <Link href={"/admin/productos/" + p.id} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => borrar(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {lista.length === 0 && <tr><td colSpan={7} className="text-center text-muted">No hay productos para mostrar.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function AdminProductoNuevo() {
  const router = useRouter();
  const { crear } = useProductos();
  return (
    <>
      <h1 className="h3 mb-3">Nuevo producto</h1>
      <FormularioProducto onGuardar={(datos) => { crear(datos); router.push("/admin/productos"); }} />
    </>
  );
}

export function AdminProductoEditar({ id }) {
  const router = useRouter();
  const { productos, actualizar } = useProductos();
  const producto = productos.find((p) => p.id === Number(id));
  if (!producto) {
    return <div className="alert alert-warning">Producto no encontrado. <Link href="/admin/productos">Volver</Link></div>;
  }
  return (
    <>
      <h1 className="h3 mb-3">Editar producto #{producto.id}</h1>
      <FormularioProducto productoInicial={producto} onGuardar={(datos) => { actualizar(producto.id, datos); router.push("/admin/productos"); }} />
    </>
  );
}
