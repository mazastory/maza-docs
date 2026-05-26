/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /(bg|text|border|from|to|shadow)-(indigo|orange|sky|amber|emerald|rose)-(300|400|500|600|800)/,
    },
    {
      pattern: /(bg|text|border|from|to|shadow)-(indigo|orange|sky|amber|emerald|rose)-(300|400|500|600|800)\/(5|10|20|30)/,
    }
  ],
  plugins: [],
}
