// Mock de next/navigation para las pruebas: no hay router real en Karma.
export function usePathname() {
  return "/admin";
}
export function useRouter() {
  return { push() {}, replace() {}, back() {} };
}
export function notFound() {}
