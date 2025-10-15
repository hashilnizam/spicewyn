/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nature-inspired Green Theme (Primary)
        primary: {
          50: '#f0fdf4',   // Very light mint
          100: '#dcfce7',  // Light mint
          200: '#bbf7d0',  // Soft mint
          300: '#86efac',  // Light green
          400: '#4ade80',  // Fresh green
          500: '#22c55e',  // Vibrant green (Main)
          600: '#16a34a',  // Forest green
          700: '#15803d',  // Deep forest
          800: '#166534',  // Dark forest
          900: '#14532d',  // Very dark forest
          950: '#052e16',  // Almost black green
        },
        // Complementary Earth Tones (Secondary)
        secondary: {
          50: '#fefce8',   // Cream
          100: '#fef9c3',  // Light yellow
          200: '#fef08a',  // Soft yellow
          300: '#fde047',  // Yellow
          400: '#facc15',  // Golden
          500: '#eab308',  // Amber (Main)
          600: '#ca8a04',  // Dark amber
          700: '#a16207',  // Bronze
          800: '#854d0e',  // Dark bronze
          900: '#713f12',  // Deep bronze
          950: '#422006',  // Almost black bronze
        },
        // iOS-style accent colors
        accent: {
          blue: '#007AFF',    // iOS Blue
          teal: '#5AC8FA',    // iOS Teal
          mint: '#00C7BE',    // iOS Mint
          cyan: '#32ADE6',    // iOS Cyan
          indigo: '#5856D6',  // iOS Indigo
        },
        // Nature palette
        nature: {
          leaf: '#22c55e',
          moss: '#4d7c0f',
          sage: '#84cc16',
          forest: '#15803d',
          sky: '#38bdf8',
          earth: '#92400e',
          sand: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Inter', 'system-ui', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'ios': '12px',
        'ios-lg': '16px',
        'ios-xl': '20px',
        'ios-2xl': '28px',
      },
      boxShadow: {
        'ios': '0 2px 16px rgba(0, 0, 0, 0.06)',
        'ios-lg': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'ios-xl': '0 16px 48px rgba(0, 0, 0, 0.1)',
        'nature': '0 4px 20px rgba(34, 197, 94, 0.15)',
        'nature-lg': '0 8px 32px rgba(34, 197, 94, 0.2)',
      },
      backdropBlur: {
        'ios': '12px',
        'ios-lg': '20px',
      },
      animation: {
        // iOS-style animations
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-out': 'fadeOut 0.3s cubic-bezier(0.4, 0, 1, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-out': 'scaleOut 0.2s cubic-bezier(0.4, 0, 1, 1)',
        'bounce-subtle': 'bounceSubtle 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.9)', opacity: '0' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(34, 197, 94, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
