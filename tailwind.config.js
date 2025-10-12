/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f6f8fa', // gris azulado muy claro
        foreground: '#1a202c', // gris oscuro frío
        primary: '#3b82f6',    // azul frío
        secondary: '#64748b',  // gris azulado
        accent: '#38bdf8',     // celeste frío
        card: '#e5eaf1',       // gris azulado claro
        muted: '#cbd5e1',      // gris frío
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
