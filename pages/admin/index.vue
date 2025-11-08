<script setup lang="ts">
import { navigateTo } from 'nuxt/app'
import { watchEffect } from 'vue'
import { useAdminAuth } from '~/composables/useAdminAuth'
definePageMeta({ layout: 'default' })

const { user } = useAdminAuth()

watchEffect(async () => {
  if (user.value) {
    await navigateTo('/admin/branitelji')
  }
})
</script>

<template>
  <section class="relative flex min-h-[70vh] flex-col items-center justify-center py-20">
    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-white to-secondary/5 opacity-60" />
    <div class="mx-auto w-full max-w-lg rounded-[2.5rem] border border-primary/10 bg-white/95 p-12 shadow-2xl shadow-primary/20 backdrop-blur">
      <div class="mb-8 space-y-3 text-center">
        <span class="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
          Admin panel
        </span>
        <h1 class="text-3xl font-bold text-slate-900">Admin prijava</h1>
        <p class="text-sm text-slate-500">Pristup je omogućen samo autoriziranom timu.</p>
      </div>
      <AdminLoginForm />
    </div>
  </section>
</template>

