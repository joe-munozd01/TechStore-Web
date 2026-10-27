// Mock de next/link para las pruebas: en Karma no existe el router de Next.js,
// así que Link se reemplaza por un <a> normal que conserva href y contenido.
export default function Link({ href, children, ...resto }) {
  return <a href={href} {...resto}>{children}</a>;
}
