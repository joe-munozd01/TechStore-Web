import FormularioContacto from "../../components/FormularioContacto";

export const metadata = { title: "Contacto | TechStore" };

export default function Contacto() {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <h1 className="h3 mb-2">Contacto</h1>
        <p className="text-muted">¿Tienes un problema con tu pedido o una consulta? Escríbenos.</p>
        <FormularioContacto />
      </div>
    </div>
  );
}
