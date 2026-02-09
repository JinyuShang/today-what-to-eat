import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      // 可访问性：添加自定义 focus ring 样式
      ringWidth: {
        DEFAULT: '2px',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
    },
  },
  plugins: [
    // 自定义样式：focus-visible 只在键盘导航时显示
    function({ addUtilities }) {
      addUtilities({
        '.focus-ring': {
          '&:focus-visible': {
            'outline': 'none',
            'box-shadow': '0 0 0 2px #fff, 0 0 0 4px #f97316',
          },
        },
        '.focus-ring-inset': {
          '&:focus-visible': {
            'outline': 'none',
            'box-shadow': 'inset 0 0 0 2px #f97316',
          },
        },
        // 确保所有交互元素在 focus 时可见
        '.accessibility-focus': {
          '&:focus-visible': {
            'outline': '2px solid #f97316',
            'outline-offset': '2px',
          },
        },
      });
    },
  ],
};
export default config;
