# TechStore - Frontend con React (Next.js)

DSY1104 Desarrollo Fullstack II - Evaluación Parcial 3 (integración con backend). Integrantes: Nicolás Figueroa, José Muñoz.

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

## Backend (necesario para iniciar sesión)

El login, el registro y la lista de usuarios del panel admin se conectan por REST al
API Gateway de [TechStore-Microservicios](https://github.com/joe-munozd01/TechStore-Microservicios)
en `http://localhost:8090`. **Primero levanta el backend** (ver su README) y después el frontend.

Si el backend está en otra dirección, copia `.env.example` a `.env.local` y cambia `NEXT_PUBLIC_API_URL`.

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

Las cuentas las crea el backend al iniciar. El administrador entra al panel en `/admin`;
el cliente no puede entrar (ve un aviso de "sin permisos").

## Sesión y seguridad

- Al iniciar sesión el backend devuelve un **token JWT** con el rol del usuario.
- La sesión (token + datos del usuario) se guarda en `localStorage` (`ts_sesion`), por eso
  se mantiene al recargar la página. Si el token vence, la sesión se cierra sola.
- Las peticiones protegidas envían `Authorization: Bearer <token>`; el gateway responde
  401 sin token y 403 si el rol no tiene permiso.

## Estructura

- `app/` - páginas (rutas) de Next.js
- `components/` - componentes React reutilizables (`components/admin/` para el panel)
- `context/` - estado compartido: carrito, sesión y productos
- `data/` - datos locales del catálogo, órdenes y blog
- `lib/api.js` - cliente REST del backend (login, registro, usuarios)
- `lib/` - además, funciones de lógica y validaciones
- `tests/` - pruebas unitarias (`*.spec.jsx`)
- `karma.conf.js` - configuración del entorno de pruebas
- `parte1-html/` - versión de la Evaluación Parcial 1 (HTML, CSS y JavaScript)
