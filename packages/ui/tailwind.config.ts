import tailwindConfig from '@repo/tailwind-config/tailwind.config';
export default { ...tailwindConfig, plugins: [require('tailwindcss-animate')] };
