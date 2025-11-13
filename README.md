
Tecnomadera — E-commerce (Next.js + Supabase)

Resumen
- Catálogo de productos por categorías, carrito y finalización vía WhatsApp.
- Panel admin con CRUD, carga/corte de imágenes, registro de ventas y reordenamiento por drag-and-drop (persistido con `position`).
- UI con Tailwind; toast promocional persistente; arreglos para iOS/Safari (modal via portal + bloqueo de scroll).

Características
- Navegación por categorías: `src/data/categories.ts` y rutas dinámicas.
- Carrito y envío a WhatsApp: `src/app/carrito/page.tsx`.
- Admin: gestionar productos y ventas, reordenamiento drag-and-drop y búsqueda: `src/app/admin/page.tsx`.
- API cliente: Supabase (`src/lib/supabaseClient.ts`), productos (`src/lib/productsApi.ts`).
- Estilos: Tailwind CSS (v4), PostCSS plugin oficial.

Tecnologías
- Next.js 15, React 19, TypeScript 5
- Supabase JS v2 (@supabase/supabase-js)
- Tailwind CSS v4 + @tailwindcss/postcss

Requisitos previos
- Node.js 18+ (recomendado 20+)
- Cuenta y proyecto en Supabase

Configuración (local)
1) Instala dependencias:
```pwsh
npm install
```
2) Variables de entorno:
	 - Copia `.env.local.example` a `.env.local` y completa:
		 - `NEXT_PUBLIC_SUPABASE_URL`
		 - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3) Ejecuta en desarrollo:
```pwsh
npm run dev
```
4) Compila para producción (opcional):
```pwsh
npm run build
npm start
```

Scripts
- `npm run dev`: Next dev (Turbopack)
- `npm run build`: Compilación de producción
- `npm start`: Servir build
- `npm run lint`: Linter ESLint

Variables de entorno
- Cliente (expuestas): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Servidor (opcional, no exponer): `SUPABASE_SERVICE_ROLE_KEY`

Notas de datos y orden manual
- La tabla `products` necesita la columna `position integer` para persistir el orden.
- Inicializa posiciones con SQL (ejemplo por `id` desc):
```sql
WITH numbered AS (
	SELECT id, ROW_NUMBER() OVER (ORDER BY id DESC) AS rn
	FROM products
)
UPDATE products p
SET position = n.rn
FROM numbered n
WHERE p.id = n.id;
```

Despliegue
- Ver `DEPLOYMENT.md` para guía (Railway). En Vercel, añade las mismas env vars.

Estructura
- `src/app/*`: páginas Next (app router)
- `src/components/*`: componentes UI (ProductCard, Header, PromoToast, Portal, etc.)
- `src/lib/*`: clientes y APIs (Supabase, productos, carrito)
- `src/data/*`: datos estáticos (categorías)

Limpieza y seguridad
- `.gitignore` ignora `.env*`. No subas `.env.local` al repo.
- Si `.env.local` ya fue añadido al git, elimínalo del índice:
```pwsh
git rm --cached .env.local
git commit -m "Remove .env.local from repo"
```

Notas de configuración
- Existe `next.config.js`. Si prefieres TypeScript, traslada la config a `next.config.ts` y elimina el archivo `.js` para evitar duplicados. Actualmente la configuración de imágenes y `reactStrictMode` está contemplada.

Licencia
- Uso personal/portafolio. Añade una licencia si piensas open source público.

