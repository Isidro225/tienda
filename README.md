# Panadería/Confitería — Next.js + Tailwind + Prisma (CRUD Admin + Pedidos)

Incluye:
- Tienda pública (catálogo, detalle de producto)
- Carrito/pedido simple (localStorage) + creación de pedidos en DB
- Panel Admin protegido (login + rol ADMIN) con CRUD de:
  - Categorías
  - Productos (nombre, descripción, precio, categoría, imagen)
  - Pedidos (cambiar estado, eliminar)

## Requisitos
- Node 18+ / 20+
- npm

## Setup rápido

1) Instalar dependencias
```bash
npm install
```

2) Crear `.env` desde el ejemplo
```bash
cp .env.example .env
```

3) Migrar DB y seed (crea admin + categorías + productos demo)
```bash
npm run prisma:migrate
npm run seed
```

4) Correr
```bash
npm run dev
```

- Sitio: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Credenciales admin
Se definen en `.env`:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Cloudinary (opcional, recomendado)
Para subir imágenes desde el CRUD sin “unsigned preset”:

1) Crear un usuario/API en Cloudinary y completar en `.env`:
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- CLOUDINARY_FOLDER (opcional)

2) Reiniciar `npm run dev`.

Si Cloudinary no está configurado, igual podés pegar una URL directa de imagen.

## Logo centrado
Podés definir:
- `NEXT_PUBLIC_LOGO_URL` (URL pública de tu logo)

## Notas de diseño
Tema blanco con acento naranja suave, topbar sticky con logo centrado, tarjetas con sombras suaves y bordes sutiles.
