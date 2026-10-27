import "bootstrap/dist/css/bootstrap.min.css";
import MarcoTienda from "../components/MarcoTienda";
import { CarritoProvider } from "../context/CarritoContext";
import { AuthProvider } from "../context/AuthContext";
import { ProductosProvider } from "../context/ProductosContext";

export const metadata = {
  title: "TechStore",
  description: "Tienda online de productos tecnológicos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ProductosProvider>
            <CarritoProvider>
              <MarcoTienda>{children}</MarcoTienda>
            </CarritoProvider>
          </ProductosProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
