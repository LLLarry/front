module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.25rem', { lineHeight: '0.35rem' }],
        sm: ['0.35rem', { lineHeight: '0.45rem' }],
        base: ['0.425rem', { lineHeight: '0.525rem' }],
        lg: ['0.525rem', { lineHeight: '0.625rem' }],
        xl: ['0.625rem', { lineHeight: '0.725rem' }]
      },
      boxShadow: {
        'l-white': '-10px 0 10px white'
      },
      height: {
        header: '72px',
        main: 'calc(100vh - 72px)'
      },
      backgroundColor: {
        main: 'rgb(244,76,88)'
      }
    }
  },
  plugins: [],
  darkMode: 'class'
}
