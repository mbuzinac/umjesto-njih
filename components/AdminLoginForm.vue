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
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="space-y-1">
      <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Admin email</label>
      <input v-model="email" type="email" required class="rounded-xl border-slate-200 text-sm" />
    </div>
    <div class="space-y-1">
      <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Lozinka</label>
      <div class="relative">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          required
          class="w-full rounded-xl border-slate-200 pr-12 text-sm"
        />
        <button type="button" class="absolute inset-y-0 right-0 px-3 text-xs text-slate-500" @click="showPassword = !showPassword">
          {{ showPassword ? 'Sakrij' : 'Prikaži' }}
        </button>
      </div>
    </div>
    <button type="submit" class="btn-primary w-full" :disabled="loading">{{ loading ? 'Prijava…' : 'Prijava' }}</button>
    <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>
  </form>
</template>

