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
          class="input-field pr-24"
        />
        <button
          type="button"
          class="absolute inset-y-0 right-2 flex items-center justify-center px-2 text-primary transition hover:text-primary/70"
          @click="showPassword = !showPassword"
          :aria-label="showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'"
        >
          <svg
            v-if="showPassword"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 0112 3c4.478 0 8.268 2.943 9.542 7a10.457 10.457 0 01-4.043 5.411"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.223 6.223A10.45 10.45 0 002.458 12c1.274 4.057 5.064 7 9.542 7 1.76 0 3.432-.45 4.89-1.243"
            />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.88 9.88a3 3 0 104.243 4.243" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
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

