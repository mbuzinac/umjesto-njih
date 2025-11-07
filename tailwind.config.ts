import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0b2f6b',
        secondary: '#f2662f',
        accent: '#f2b544',
        navy: '#0f1f3a',
        dusk: '#1e3257'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}

