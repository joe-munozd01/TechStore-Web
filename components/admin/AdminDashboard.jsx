'use client';
import Link from "next/link";
import { useMemo } from "react";
import { useProductos } from "../../context/ProductosContext";
import { useAuth } from "../../context/AuthContext";
import { obtenerUsuarios } from "../../data/usuarios";
import { criticosDe } from "../../lib/catalogo";
import { ventasTotales } from "../../lib/reportes";
import { formatearPrecio } from "../ProductCard";
import useOrdenes from "./useOrdenes";

function Tarjeta({ color, titulo, valor, detalle }) {
  return (
    <div className="col-12 col-md-4">
      <div className={"card text-white h-100 bg-" + color}>
        <div className="card-body">
          <p className="mb-1">{titulo}</p>
          <p className="display-6 mb-1">{valor}</p>
          <small>{detalle}</small>
        </div>
      </div>
    </div>
  );
}

const accesos = [
  { href: "/admin/ordenes", titulo: "Órdenes", texto: "Revisa las compras realizadas y sus boletas." },
  { href: "/admin/productos", titulo: "Productos", texto: "Crea, edita y elimina productos." },
  { href: "/admin/usuarios", titulo: "Usuarios", texto: "Consulta las cuentas registradas." },
  { href: "/admin/reportes", titulo: "Reportes", texto: "Ventas y productos más vendidos." },
];

export default function AdminDashboard() {
  const { productos } = useProductos();
  const { listo } = useAuth();
  const ordenes = useOrdenes();
  const usuarios = useMemo(() => obtenerUsuarios(), [listo]);
  const pagadas = ordenes.filter((o) => o.ok);

  return (
    <>
      <h1 className="h3">Dashboard</h1>
      <p className="text-muted">Resumen de la actividad de la tienda.</p>
      <div className="row g-3 mb-4">
        <Tarjeta color="primary" titulo="Compras" valor={pagadas.length} detalle={"Vendido: " + formatearPrecio(ventasTotales(ordenes))} />
        <Tarjeta color="success" titulo="Productos" valor={productos.length} detalle={"Stock crítico: " + criticosDe(productos).length} />
        <Tarjeta color="warning" titulo="Usuarios" valor={usuarios.length} detalle="Cuentas registradas" />
      </div>
      <div className="row g-3">
        {accesos.map((a) => (
          <div className="col-12 col-md-6 col-xl-3" key={a.href}>
            <Link href={a.href} className="card h-100 text-decoration-none shadow-sm">
              <div className="card-body">
                <h2 className="h6">{a.titulo}</h2>
                <p className="text-muted small mb-0">{a.texto}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
