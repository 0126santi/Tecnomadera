Pasos para desplegar en Railway (desde GitHub)

1) En GitHub:
   - Verifica que tu repo está en https://github.com/0126santi/Tecnomadera

2) En tu máquina local (antes de desplegar):
   - Copia `.env.local.example` a `.env.local` y rellena las variables con tus valores reales:
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
   - Ejecuta localmente para comprobar:
     ```pwsh
     npm run build
     ```

3) En Railway:
   - Accede a https://railway.app/ y crea un nuevo proyecto (o abre uno existente).
   - Selecciona "Deploy from GitHub" y autoriza Railway para acceder a tu cuenta/repos.
   - Selecciona `0126santi/Tecnomadera` como repositorio.
   - En Settings > Environment Variables añade las variables EXACTAMENTE como:
       - `NEXT_PUBLIC_SUPABASE_URL` => https://your-supabase-url.supabase.co
       - `NEXT_PUBLIC_SUPABASE_ANON_KEY` => your-anon-key
     (Si necesitas una service role key para operaciones de servidor, añade `SUPABASE_SERVICE_ROLE_KEY` y no la publiques al cliente.)
   - Inicia el deploy. Railway mostrará los logs; si el build falla, revisa las variables.

4) Notas sobre seguridad y buenas prácticas:
   - No subas `.env.local` al repo. Usa `ENV` variables en Railway.
   - Verifica si alguna variable debe ser `NEXT_PUBLIC_` o no según necesites exponerla al cliente.

5) Problemas comunes:
   - Error `supabaseUrl is required`: significa que `NEXT_PUBLIC_SUPABASE_URL` no está definido en el entorno de build.
   - Si Railway demuestra problemas con Turbopack, intenta cambiar a `next build` sin `--turbopack` en `package.json` temporalmente.

Si quieres, puedo:
- Crear `.env.local` con valores que pegues aquí (no recomendable compartir claves en el chat), o
- Ejecutar `npm run build` localmente después de que pegues tus valores en `.env.local`, o
- Guiarte paso a paso por la UI de Railway mientras configuras las variables.
