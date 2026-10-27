'use client';

// Barra de búsqueda controlada: no guarda estado propio,
// recibe el texto (props) y avisa los cambios con onChange.
export default function SearchBar({ valor, onChange }) {
  return (
    <input
      type="search"
      className="form-control"
      placeholder="Buscar producto..."
      aria-label="Buscar producto"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
