import { CategoriaPagina } from "../../../components/PaginasTienda";

export default async function Categoria({ params }) {
  const { slug } = await params;
  return <CategoriaPagina slug={slug} />;
}
