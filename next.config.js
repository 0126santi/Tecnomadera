/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      // Agrega aquí los dominios externos de imágenes que usarás, por ejemplo:
      'your-supabase-project-id.supabase.co',
      'lh3.googleusercontent.com',
      // ...otros dominios
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};
