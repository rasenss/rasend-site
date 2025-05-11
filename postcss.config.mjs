const config = {
  plugins: {
    '@tailwindcss/postcss': {
      content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}'
      ],
      theme: {
        extend: {
          colors: {
            'blue-monte': '#0F172A',
            'blue-drop': '#7DD3FC',
          }
        }
      },
      plugins: [],
    },
    'autoprefixer': {},
    'cssnano': process.env.NODE_ENV === 'production' ? { preset: 'default' } : false
  }
}

export default config
