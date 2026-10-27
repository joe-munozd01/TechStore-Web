import { AdminBoleta } from "../../../../components/admin/AdminOrdenes";

export default async function Page({ params }) {
  const { id } = await params;
  return <AdminBoleta id={id} />;
}
