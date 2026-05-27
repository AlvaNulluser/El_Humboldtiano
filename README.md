# El Humboldtiano

> Periódico universitario de la Universidad Alejandro de Humboldt — Caracas, Venezuela.

[![Astro](https://img.shields.io/badge/Astro-6.3.3-BC52EE?logo=astro)](https://astro.build)
[![Node](https://img.shields.io/badge/node-%3E%3D18-339933?logo=nodedotjs)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Tabla de contenidos

- [Sobre el proyecto](#sobre-el-proyecto)
- [Stack tecnológico](#stack-tecnológico)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Desarrollo](#desarrollo)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Uso del CMS](#uso-del-cms)
- [Licencia](#licencia)

## Sobre el proyecto

El Humboldtiano es el periódico digital de la Universidad Alejandro de Humboldt (UAH). 
Este sitio está construido como un sitio estático (SSG) con Astro, lo que garantiza 
velocidad, accesibilidad y bajo consumo de recursos.

## Stack tecnológico

- [Astro](https://astro.build) — Framework SSG
- [TypeScript](https://www.typescriptlang.org) — Tipado estático
- [StaticCMS](https://staticcms.org) (antes Netlify CMS) — Gestión de contenido editorial
- [Vercel](https://vercel.com) — Despliegue y hosting

## Requisitos previos

- [Node.js](https://nodejs.org) >= 18
- [npm](https://npmjs.com) (incluido con Node)

## Instalación

```bash
git clone git@github.com:Jvske-max/El_Humboldtiano.git
cd El_Humboldtiano
npm install
```

## Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Previsualizar build local
npm run preview

# Linting
npm run lint

# Formatear código
npm run format

# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e
```

## Estructura del proyecto

```
├── public/               # Archivos estáticos
│   ├── admin/            # Panel de StaticCMS
│   └── img/              # Imágenes subidas
├── src/
│   ├── content/
│   │   └── articles/     # Artículos en Markdown
│   ├── layouts/          # Layouts Astro
│   ├── pages/            # Rutas del sitio
│   └── styles/           # Estilos globales
├── tests/
│   ├── unit/             # Tests con Vitest
│   └── e2e/              # Tests con Playwright
├── astro.config.mjs      # Configuración de Astro
├── src/content.config.ts # Esquema de contenido
└── package.json
```

## Uso del CMS

El contenido editorial se gestiona a través de StaticCMS. Para editores, 
consultá la [Guía Editorial](./EDITORIAL_GUIDE.md).

El CMS está disponible en `/admin` en el sitio desplegado.

## Licencia

[MIT](LICENSE)


