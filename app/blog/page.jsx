import { obtenerArticulos } from "../../data/blog";
import ListaBlog from "../../components/ListaBlog";

export const metadata = { title: "Blog | TechStore" };

export default function Blog() {
  return (
    <>
      <h1 className="h3 mb-3">Blog</h1>
      <ListaBlog articulos={obtenerArticulos()} />
    </>
  );
}
