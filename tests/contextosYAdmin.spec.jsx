import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../components/Navbar";
import DetalleProducto from "../components/DetalleProducto";
import AdminDashboard from "../components/admin/AdminDashboard";
import { AdminOrdenes, AdminBoleta } from "../components/admin/AdminOrdenes";
import { AdminReportes } from "../components/admin/AdminOtros";
import { AuthProvider } from "../context/AuthContext";
import { CarritoProvider, useCarrito } from "../context/CarritoContext";
import { ProductosProvider, useProductos } from "../context/ProductosContext";
import { reiniciarProductos } from "../data/productos";
import { reiniciarOrdenes } from "../data/ordenes";

const producto = { id: 3, nombre: "Teclado Mecánico", categoria: "Periféricos", marca: "SteelSeries", descripcion: "Teclado RGB", precio: 29990, precioOferta: null, stock: 5, imagen: "/t.jpg" };
const datos = { nombre: "Ana", apellidos: "Pérez", correo: "ana@correo.cl", calle: "Los Aromos 123", departamento: "", region: "Valparaíso", comuna: "Quilpué", indicaciones: "" };

function limpiar() {
  localStorage.clear();
  reiniciarOrdenes();
  reiniciarProductos();
}

function PanelCarrito() {
  const { unidades, orden, agregar, finalizarCompra } = useCarrito();
  return (
    <div>
      <span data-testid="unidades">{unidades}</span>
      <span data-testid="orden">{orden ? orden.id + ":" + orden.ok : "-"}</span>
      <button onClick={() => agregar(producto)}>agregar</button>
      <button onClick={() => finalizarCompra(datos, true)}>pagar</button>
    </div>
  );
}

describe("CarritoContext", () => {
  beforeEach(limpiar);

  it("agregar suma unidades al carrito", () => {
    render(<CarritoProvider><PanelCarrito /></CarritoProvider>);
    fireEvent.click(screen.getByText("agregar"));
    fireEvent.click(screen.getByText("agregar"));
    expect(screen.getByTestId("unidades").textContent).toBe("2");
  });

  it("finalizarCompra vacía el carrito, registra la orden y la guarda en localStorage", () => {
    render(<CarritoProvider><PanelCarrito /></CarritoProvider>);
    fireEvent.click(screen.getByText("agregar"));
    fireEvent.click(screen.getByText("pagar"));
    expect(screen.getByTestId("unidades").textContent).toBe("0");
    expect(screen.getByTestId("orden").textContent).toBe("1:true");
    expect(JSON.parse(localStorage.getItem("ts_ordenes")).length).toBe(1);
  });
});

function PanelProductos() {
  const { productos, crear, actualizar } = useProductos();
  return (
    <div>
      <span data-testid="cantidad">{productos.length}</span>
      <span data-testid="primero">{productos[0].nombre}</span>
      <button onClick={() => crear({ nombre: "Webcam", categoria: "Periféricos", marca: "Logitech", precio: 25990 })}>crear</button>
      <button onClick={() => actualizar(1, { nombre: "Notebook Renovado" })}>actualizar</button>
    </div>
  );
}

describe("ProductosContext", () => {
  beforeEach(limpiar);

  it("crear y actualizar cambian la lista y se guardan en localStorage", () => {
    render(<ProductosProvider><PanelProductos /></ProductosProvider>);
    fireEvent.click(screen.getByText("crear"));
    expect(screen.getByTestId("cantidad").textContent).toBe("7");
    fireEvent.click(screen.getByText("actualizar"));
    expect(screen.getByTestId("primero").textContent).toBe("Notebook Renovado");
    expect(JSON.parse(localStorage.getItem("ts_productos")).length).toBe(7);
  });
});

describe("Navbar y DetalleProducto con carrito", () => {
  beforeEach(limpiar);

  it("el Navbar muestra las unidades del carrito y abre el menú móvil", () => {
    const item = { id: 3, nombre: "Teclado", precio: 29990, stock: 5, cantidad: 3, imagen: "/t.jpg" };
    render(<AuthProvider><CarritoProvider inicial={[item]}><Navbar /></CarritoProvider></AuthProvider>);
    expect(screen.getByText("3")).toBeTruthy();
    const boton = screen.getByRole("button", { name: "Abrir menú" });
    expect(boton.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(boton);
    expect(boton.getAttribute("aria-expanded")).toBe("true");
  });

  it("DetalleProducto agrega al carrito y deshabilita el botón sin stock", () => {
    const { unmount } = render(<CarritoProvider><DetalleProducto producto={producto} /><PanelCarrito /></CarritoProvider>);
    fireEvent.click(screen.getAllByRole("button", { name: "Agregar al carrito" })[0]);
    expect(screen.getByTestId("unidades").textContent).toBe("1");
    unmount();
    render(<CarritoProvider><DetalleProducto producto={{ ...producto, stock: 0 }} /></CarritoProvider>);
    expect(screen.getByRole("button", { name: "Agregar al carrito" }).disabled).toBe(true);
  });
});

describe("pantallas del administrador con órdenes guardadas", () => {
  const orden = { id: 1, nro: "#20261027101", ok: true, fecha: "2026-10-27T12:00:00.000Z", datos, items: [{ id: 3, nombre: "Teclado Mecánico", precio: 29990, cantidad: 2, stock: 5 }], total: 59980 };

  beforeEach(() => {
    limpiar();
    localStorage.setItem("ts_ordenes", JSON.stringify([orden]));
  });

  it("AdminOrdenes lista la orden con su estado", () => {
    render(<AdminOrdenes />);
    expect(screen.getByText("#20261027101")).toBeTruthy();
    expect(screen.getByText("Pagada")).toBeTruthy();
  });

  it("AdminBoleta muestra el detalle de la orden o avisa si no existe", () => {
    const { unmount } = render(<AdminBoleta id="1" />);
    expect(screen.getByText("Boleta #20261027101")).toBeTruthy();
    unmount();
    render(<AdminBoleta id="99" />);
    expect(screen.getByText(/Orden no encontrada/)).toBeTruthy();
  });

  it("AdminReportes calcula ventas y ranking desde las órdenes", () => {
    render(<AdminReportes />);
    expect(screen.getAllByText("$59.980").length).toBe(2);
    expect(screen.getByText("Teclado Mecánico")).toBeTruthy();
  });

  it("AdminDashboard resume compras, ventas y productos", () => {
    render(<AuthProvider><ProductosProvider><AdminDashboard /></ProductosProvider></AuthProvider>);
    expect(screen.getByText(/Vendido: \$59\.980/)).toBeTruthy();
    expect(screen.getByText(/Stock crítico: 3/)).toBeTruthy();
  });
});
