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
  <div class="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
    <div class="mb-6 space-y-2 text-center">
      <h1 class="text-2xl font-semibold text-slate-900">Admin prijava</h1>
      <p class="text-sm text-slate-500">Pristup je omogućen samo autoriziranom timu.</p>
    </div>
    <AdminLoginForm />
  </div>
</template>

