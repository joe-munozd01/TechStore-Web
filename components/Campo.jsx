// Un campo de formulario con su etiqueta y su mensaje de error (clases de Bootstrap).
export default function Campo({ id, etiqueta, error, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      {children}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
