# TechStore - Frontend con React (Next.js)

DSY1104 Desarrollo Fullstack II - Evaluación Parcial 2. Integrantes: Nicolás Figueroa, José Muñoz.

## Tecnologías

- Next.js + React (componentes con props y estado)
- Bootstrap 5 (diseño responsivo)
- Jasmine + Karma (pruebas unitarias, con cobertura)

## Requisitos

Node.js 20 o superior (incluye `npm`) y Git.

### Linux

```bash
# Fedora
sudo dnf install nodejs git

# Ubuntu / Debian
sudo apt install nodejs npm git
```

### Windows

1. Instala Node.js (versión LTS) desde https://nodejs.org
2. Instala Git desde https://git-scm.com
3. Abre PowerShell o el Símbolo del sistema.

Si PowerShell muestra un error de "scripts deshabilitados" al usar `npm`, ejecuta una vez:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## Cómo ejecutar

Los mismos comandos funcionan en Linux y en Windows. Desde la carpeta del proyecto:

```bash
git clone https://github.com/joe-munozd01/TechStore-Web.git
cd TechStore-Web
npm install
npm run dev        # sitio en http://localhost:3000
npm test           # pruebas unitarias (Karma + Jasmine) y resumen de cobertura
```

Para detener el servidor, presiona `Ctrl + C` en la terminal.
El reporte de cobertura en HTML queda en `coverage/index.html`.

## Cuentas de prueba

| Rol           | Correo                 | Contraseña  |
| ------------- | ---------------------- | ----------- |
| Administrador | admin@techstore.cl     | Admin123    |
| Cliente       | cliente@techstore.cl   | Cliente123  |

El administrador entra al panel en `/admin`.

## Estructura

- `app/` - páginas (rutas) de Next.js
- `components/` - componentes React reutilizables (`components/admin/` para el panel)
- `context/` - estado compartido: carrito, sesión y productos
- `data/` - fuente de datos simulada con CRUD (productos, usuarios, órdenes)
- `lib/` - funciones de lógica y validaciones
- `tests/` - pruebas unitarias (`*.spec.jsx`)
- `karma.conf.js` - configuración del entorno de pruebas
- `parte1-html/` - versión de la Evaluación Parcial 1 (HTML, CSS y JavaScript)
