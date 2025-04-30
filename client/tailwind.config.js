export const content = [
  './src/**/*.html',
  './src/**/*.js',
  './src/**/*.jsx',
];

export const theme = {
  extend: {
    colors: {
      'custom-blue': '#000814',
    },
    borderRadius: {
      xl: '1rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
    },
    boxShadow: {
      card: '0 10px 30px rgba(0, 0, 0, 0.1)',
    },
  },
};

export const plugins = [require('@tailwindcss/forms')];
