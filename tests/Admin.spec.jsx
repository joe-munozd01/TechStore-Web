import { render, screen, fireEvent } from "@testing-library/react";
import AdminLayout from "../components/admin/AdminLayout";
import { AdminProductos } from "../components/admin/AdminProductos";
import FormularioProducto from "../components/admin/FormularioProducto";
import { AuthProvider } from "../context/AuthContext";
import { ProductosProvider } from "../context/ProductosContext";
import { reiniciarProductos } from "../data/productos";

const admin = { id: 1, nombre: "Admin", apellidos: "TechStore", correo: "admin@techstore.cl", rol: "admin" };
const cliente = { id: 2, nombre: "Cliente", apellidos: "Demo", correo: "cliente@techstore.cl", rol: "cliente" };

function conSesion(usuario) {
  return render(
    <AuthProvider usuarioInicial={usuario}>
      <AdminLayout><p>contenido del panel</p></AdminLayout>
    </AuthProvider>
  );
}

describe("AdminLayout (acceso al panel)", () => {
  beforeEach(() => localStorage.clear());

  it("pide iniciar sesión cuando no hay usuario", () => {
    conSesion(null);
    expect(screen.getByText(/Debes iniciar sesión/)).toBeTruthy();
    expect(screen.queryByText("contenido del panel")).toBeNull();
  });

  it("niega el acceso a un cliente", () => {
    conSesion(cliente);
    expect(screen.getByText(/No tienes permisos/)).toBeTruthy();
  });

  it("muestra el panel a un administrador", () => {
    conSesion(admin);
    expect(screen.getByText("contenido del panel")).toBeTruthy();
    expect(screen.getByText("Dashboard")).toBeTruthy();
  });
});

describe("AdminProductos (CRUD con contexto)", () => {
  beforeEach(() => {
    localStorage.clear();
    reiniciarProductos();
  });

  const renderizar = (props) => render(<ProductosProvider><AdminProductos {...props} /></ProductosProvider>);

  it("lista todos los productos en la tabla", () => {
    renderizar();
    expect(screen.getByText("Notebook Gamer X1")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Eliminar" }).length).toBe(6);
  });

  it("elimina un producto cuando se confirma (mock de window.confirm)", () => {
    spyOn(window, "confirm").and.returnValue(true);
    renderizar();
    fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(window.confirm).toHaveBeenCalled();
    expect(screen.queryByText("Notebook Gamer X1")).toBeNull();
  });

  it("no elimina si el administrador cancela", () => {
    spyOn(window, "confirm").and.returnValue(false);
    renderizar();
    fireEvent.click(screen.getAllByRole("button", { name: "Eliminar" })[0]);
    expect(screen.getByText("Notebook Gamer X1")).toBeTruthy();
  });

  it("con soloCriticos muestra únicamente los productos con poco stock", () => {
    renderizar({ soloCriticos: true });
    expect(screen.getByText("Disco SSD 1TB")).toBeTruthy();
    expect(screen.queryByText("Mochila Antirrobo")).toBeNull();
  });
});

describe("FormularioProducto", () => {
  const escribir = (etiqueta, valor) => fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });

  it("muestra errores y no guarda si faltan datos", () => {
    const onGuardar = jasmine.createSpy("onGuardar");
    render(<FormularioProducto onGuardar={onGuardar} />);
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
    expect(screen.getByText("Ingresa el nombre del producto.")).toBeTruthy();
    expect(onGuardar).not.toHaveBeenCalled();
  });

  it("envía los datos con los números convertidos", () => {
    const onGuardar = jasmine.createSpy("onGuardar");
    render(<FormularioProducto onGuardar={onGuardar} />);
    escribir("Nombre", "Webcam HD");
    escribir("Categoría", "Periféricos");
    escribir("Marca", "Logitech");
    escribir("Precio", "25990");
    escribir("Stock", "7");
    fireEvent.click(screen.getByRole("button", { name: "Guardar producto" }));
    const enviado = onGuardar.calls.mostRecent().args[0];
    expect(enviado.precio).toBe(25990);
    expect(enviado.stock).toBe(7);
    expect(enviado.precioOferta).toBeNull();
  });
});
