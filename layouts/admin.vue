<script setup lang="ts">
import { navigateTo } from 'nuxt/app'
import { useAdminAuth } from '~/composables/useAdminAuth'
const { logout, user } = useAdminAuth()

const handleLogout = async () => {
  await logout()
  await navigateTo('/admin')
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <NuxtLink to="/admin" class="text-lg font-semibold text-primary">Admin panel</NuxtLink>
        <div class="flex items-center gap-4 text-sm text-slate-600">
          <span v-if="user">{{ user.email }}</span>
          <button type="button" class="btn-secondary" @click="handleLogout">Odjava</button>
        </div>
      </div>
    </header>
    <div class="mx-auto flex w-full max-w-6xl gap-6 px-4 py-8">
      <aside class="hidden w-56 flex-shrink-0 flex-col gap-2 md:flex">
        <NuxtLink to="/admin/branitelji" class="btn-secondary w-full">Branitelji</NuxtLink>
        <NuxtLink to="/admin/sjecanja" class="btn-secondary w-full">Sjećanja</NuxtLink>
      </aside>
      <main class="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <slot />
      </main>
    </div>
  </div>
</template>

