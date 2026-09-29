/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'cafe': {
          50:  '#F5F1EA', /* Kenia AA */
          100: '#E8DFD1',
          200: '#D6C6AE',
          300: '#C3AD8B',
          400: '#B09468',
          500: '#9E7A46',
          600: '#6D4C41', /* Tostado Oscuro */
          700: '#543B33',
          800: '#453029',
          900: '#3B2F2A', /* Brasil Natural */
          950: '#261E1B',
        },
        'verde': {
          50:  '#E4EDE8',
          100: '#B0B7B1', /* Perú Orgánico */
          200: '#8DA396',
          300: '#6A907B',
          400: '#487C60',
          500: '#2E7D32', /* Terruño Tropical */
          600: '#276829',
          700: '#205421',
          800: '#194019',
          900: '#1B2E24', /* Etiopía Yirgacheffe */
          950: '#111D17',
        },
        'azul': {
          50:  '#E9ECEE',
          100: '#C8D3D8',
          200: '#A7BAC2',
          300: '#86A1AB',
          400: '#658895',
          500: '#607D8B', /* Cielo Andino */
          600: '#516A76',
          700: '#435862',
          800: '#34454E',
          900: '#3F4F56', /* Indonesia Sumatra */
          950: '#242D31',
        },
        'crema': {
          50:  '#FDFCFB',
          100: '#F5F1EA', /* Kenia AA */
          200: '#EAE1D3',
          300: '#E0D2BC',
          400: '#D5C3A5',
          500: '#CBB48E',
          600: '#9E8C6F',
          700: '#726550',
          800: '#453D30',
          900: '#1B1813',
          950: '#0E0C09',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(0,0,0,0.08)',
        'bottom-sheet': '0 -4px 24px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
