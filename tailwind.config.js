/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // 深蓝色
        secondary: '#1E40AF', // 更深的蓝色
        background: '#111827', // 深灰色背景
        card: '#1F2937', // 卡片背景
        text: {
          primary: '#F3F4F6', // 主要文字颜色
          secondary: '#9CA3AF', // 次要文字颜色
        },
        border: '#374151', // 边框颜色
      },
    },
  },
  plugins: [],
} 