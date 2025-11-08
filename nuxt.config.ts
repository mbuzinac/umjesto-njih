// https://nuxt.com/docs/api/configuration/nuxt-config
/// <reference types="nuxt" />
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-08-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '~/assets/css/tailwind.css',
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css'
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  app: {
    head: {
      title: 'Umjesto njih',
      meta: [
        { name: 'description', content: 'Digitalna memorijalna platforma branitelja.' }
      ]
    }
  },
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    supabaseBucket: process.env.SUPABASE_STORAGE_BUCKET || '',
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || '',
      supabaseBucket: process.env.NUXT_PUBLIC_SUPABASE_BUCKET || '',
      adminEmail: process.env.NUXT_PUBLIC_ADMIN_EMAIL || ''
    }
  }
})
