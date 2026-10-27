'use client';
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import FormularioCheckout from "./FormularioCheckout";
import { formatearPrecio } from "./ProductCard";

// Página de pago: resumen del carrito + formulario. Al confirmar, simula el pago
// y lleva a la vista de compra exitosa o de error.
export default function CheckoutPagina() {
  const router = useRouter();
  const { items, total, orden, finalizarCompra } = useCarrito();
  const { usuario } = useAuth();
  const [procesando, setProcesando] = useState(false);

  if (procesando) return <p>Procesando pago...</p>;

  if (items.length === 0) {
    return (
      <div className="alert alert-info">
        No hay productos para pagar. <Link href="/productos">Ver productos</Link>
      </div>
    );
  }

  const confirmar = (datos, simularError) => {
    const exito = !simularError;
    setProcesando(true);
    finalizarCompra(datos, exito);
    router.push(exito ? "/comprar/ok" : "/comprar/error");
  };

  // Si volvemos desde un pago con error se recuperan los datos ingresados;
  // si hay sesión iniciada, se completan nombre, apellidos y correo.
  let datosIniciales;
  if (orden && !orden.ok) datosIniciales = orden.datos;
  else if (usuario) datosIniciales = { nombre: usuario.nombre, apellidos: usuario.apellidos, correo: usuario.correo };

  return (
    <div className="row g-4">
      <div className="col-12 col-lg-7">
        <FormularioCheckout total={total} datosIniciales={datosIniciales} onConfirmar={confirmar} />
      </div>
      <div className="col-12 col-lg-5">
        <h2 className="h5">Resumen del carrito</h2>
        <ul className="list-group">
          {items.map((i) => (
            <li key={i.id} className="list-group-item d-flex justify-content-between">
              <span>{i.nombre} x {i.cantidad}</span>
              <span>{formatearPrecio(i.precio * i.cantidad)}</span>
            </li>
          ))}
          <li className="list-group-item d-flex justify-content-between fw-bold">
            <span>Total a pagar</span>
            <span>{formatearPrecio(total)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
