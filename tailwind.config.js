module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.25rem', { lineHeight: '0.35rem' }],
        sm: ['0.35rem', { lineHeight: '0.45rem' }],
        base: ['0.45rem', { lineHeight: '0.55rem' }],
        lg: ['0.55rem', { lineHeight: '0.65rem' }],
        xl: ['0.65rem', { lineHeight: '0.75rem' }]
      },
      boxShadow: {
        'l-white': '-10px 0 10px white'
      }
    }
  },
  plugins: []
}
