/** @type {import('tailwindcss').Config} */
module.exports = {
  // IMPORTANT: Do NOT scan `node_modules` (it can generate invalid classes).
  // Keep this limited to your application source files.
  content: [
    './App.{js,jsx,ts,tsx}',
    './index.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        button: '#FF48A7',
        lightPinkBorder: '#FFB6D9',
        
      },
      fontSize: {
        heading: 24,
        body: 18,
        rest: 14,
      },
      fontFamily: {
        // Use exact name as registered when fonts are linked (e.g. "Plus Jakarta Sans" or "PlusJakartaSans-Regular")
        openSans: ['Plus Jakarta Sans'],
        hindi: ['Plus Jakarta Sans'],
      },
    },
  },
  plugins: [],
}

