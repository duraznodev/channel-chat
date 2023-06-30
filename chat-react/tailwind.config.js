/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
  theme: {
    extend: {},
  },
  safelist: [{pattern: /bg-(.*)-(.*)/}, {pattern: /text-(.*)-(.*)/}],
}
