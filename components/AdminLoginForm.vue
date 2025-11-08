<script setup lang="ts">
import { ref } from 'vue'
import { useAdminAuth } from '~/composables/useAdminAuth'
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const { login, loading, error } = useAdminAuth()

const handleSubmit = async () => {
  try {
    await login(email.value, password.value)
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <form class="space-y-7" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <label class="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">Admin email</label>
        <input
          v-model="email"
          type="email"
          required
          autocomplete="username"
          placeholder="ime.prezime@domena.hr"
          class="input-field"
        />
    </div>
    <div class="space-y-2">
      <label class="text-xs font-semibold uppercase tracking-[0.35em] text-primary/70">Lozinka</label>
      <div class="relative">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          required
          autocomplete="current-password"
          placeholder="••••••••"
          class="input-field pr-12"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-1.5 flex items-center justify-center px-2 text-primary transition hover:text-primary/70"
          @click="showPassword = !showPassword"
          :aria-label="showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'"
        >
          <span v-if="showPassword" class="text-[18px] leading-none">👁️‍🗨️</span>
          <span v-else class="text-[18px] leading-none">👁️</span>
        </button>
      </div>
    </div>
    <button type="submit" class="btn-primary w-full py-3 text-base" :disabled="loading">
      {{ loading ? 'Prijava…' : 'Prijava' }}
    </button>
    <p v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
      {{ error }}
    </p>
  </form>
</template>

