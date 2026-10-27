import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "TechStore",
  description: "Tienda online de productos tecnológicos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main className="container py-4">{children}</main>
        <footer className="container py-3 text-muted small border-top">
          TechStore &copy; 2026 - Proyecto académico DSY1104 Desarrollo Fullstack II
        </footer>
      </body>
    </html>
  );
}
