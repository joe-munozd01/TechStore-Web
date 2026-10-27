# TechStore - Frontend con React (Next.js)

Proyecto académico DSY1104 Desarrollo Fullstack II (Duoc UC) - Evaluación Parcial 2.
Integrantes: Nicolás Figueroa, José Muñoz.

## Tecnologías
- Next.js + React (componentes con props y estado)
- Bootstrap 5 (diseño responsivo)
- Jasmine + Karma (pruebas unitarias, con cobertura)

## Cómo ejecutar
```bash
npm install
npm run dev        # sitio en http://localhost:3000
npm test           # pruebas unitarias (Karma + Jasmine) y resumen de cobertura
```
El reporte de cobertura en HTML queda en `coverage/index.html`.

## Estructura
- `app/` - páginas (rutas) de Next.js
- `components/` - componentes React reutilizables
- `data/productos.js` - fuente de datos simulada con CRUD
- `tests/` - pruebas unitarias (`*.spec.jsx`)
- `karma.conf.js` - configuración del entorno de pruebas
