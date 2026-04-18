/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // 👈 ADD THIS LINE
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  // ... rest of config
}