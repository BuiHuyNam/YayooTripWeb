// // tailwind.config.js
// const colors = require('tailwindcss/colors');

// module.exports = {
//   content: ["./src/**/*.{html,ts}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: colors.emerald, // 👈 đổi sang indigo (hoặc emerald/rose/teal/slate...)
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: ['class'], // bật chế độ dark qua class
  content: ['./src/**/*.{html,ts}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // Màu thương hiệu
        primary: {
          ...colors.cyan,         // thừa hưởng thang 50-900 của cyan
          DEFAULT: '#0298A2',     // màu chủ đạo (brand)
          foreground: '#ffffff',  // chữ trên nền primary
        },

        // Màu phụ/nhấn
        accent: {
          ...colors.teal,
          DEFAULT: '#6AC3C9',     // nhấn nhẹ (hero gradient)
        },

        // Màu dùng cho bg/fg tổng thể
        background: '#ffffff',
        foreground: '#111827',     // gần gray-900

        // Màu phụ trợ cho card, text mờ, border...
        secondary: {
          ...colors.slate,
          DEFAULT: colors.slate[200], // nền phụ nhạt (dùng bg-secondary/10, v.v.)
        },
        muted: {
          DEFAULT: '#F3F4F6',         // gần gray-100
          foreground: '#6B7280',      // gần gray-500
        },
        border: '#E5E7EB',            // gray-200
        input: '#E5E7EB',
        ring: '#0298A2',
      },
    },
  },
  plugins: [],
};
