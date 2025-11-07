<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import type { Defender } from '~/types/models'
import { useAdminAuth } from '~/composables/useAdminAuth'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const defenders = ref<Defender[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const editingId = ref<string | null>(null)

const form = reactive({
  ime: '',
  prezime: '',
  godina_rođenja: '' as string | number,
  godina_pogibije: '' as string | number,
  mjesto_rođenja: '',
  mjesto_pogibije: '',
  fotka_url: '',
  jedinica: ''
})

const resetForm = () => {
  form.ime = ''
  form.prezime = ''
  form.godina_rođenja = ''
  form.godina_pogibije = ''
  form.mjesto_rođenja = ''
  form.mjesto_pogibije = ''
  form.fotka_url = ''
  form.jedinica = ''
  editingId.value = null
}

const { adminFetch } = useAdminAuth()

const loadDefenders = async () => {
  loading.value = true
  error.value = null
  try {
    defenders.value = await adminFetch<Defender[]>('/api/defenders')
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

const submit = async () => {
  loading.value = true
  error.value = null

  const payload = {
    ime: form.ime,
    prezime: form.prezime,
    godina_rođenja: form.godina_rođenja ? Number(form.godina_rođenja) : null,
    godina_pogibije: form.godina_pogibije ? Number(form.godina_pogibije) : null,
    mjesto_rođenja: form.mjesto_rođenja,
    mjesto_pogibije: form.mjesto_pogibije,
    fotka_url: form.fotka_url,
    jedinica: form.jedinica
  }

  try {
    if (editingId.value) {
      await adminFetch<Defender>(`/api/defenders/${editingId.value}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      })
    } else {
      await adminFetch<Defender>('/api/defenders', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
    }
    await loadDefenders()
    resetForm()
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

const editDefender = (defender: Defender) => {
  editingId.value = defender.id
  form.ime = defender.ime
  form.prezime = defender.prezime
  form.godina_rođenja = defender.godina_rođenja || ''
  form.godina_pogibije = defender.godina_pogibije || ''
  form.mjesto_rođenja = defender.mjesto_rođenja
  form.mjesto_pogibije = defender.mjesto_pogibije
  form.fotka_url = defender.fotka_url
  form.jedinica = defender.jedinica
}

const deleteDefender = async (id: string) => {
  if (!confirm('Sigurno obrisati branitelja?')) {
    return
  }
  loading.value = true
  error.value = null
  try {
    await adminFetch(`/api/defenders/${id}`, { method: 'DELETE' })
    await loadDefenders()
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDefenders()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Branitelji</h1>
        <p class="text-sm text-slate-500">Dodaj, ažuriraj ili obriši zapise branitelja.</p>
      </div>
    </header>

    <section class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h2 class="mb-4 text-lg font-semibold text-slate-900">
        {{ editingId ? 'Uredi branitelja' : 'Dodaj novog branitelja' }}
      </h2>
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="submit">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Ime</label>
          <input v-model="form.ime" type="text" required class="rounded-xl border-slate-200 text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Prezime</label>
          <input v-model="form.prezime" type="text" required class="rounded-xl border-slate-200 text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Godina rođenja</label>
          <input v-model="form.godina_rođenja" type="number" min="1900" max="2100" class="rounded-xl border-slate-200 text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Godina pogibije</label>
          <input v-model="form.godina_pogibije" type="number" min="1900" max="2100" class="rounded-xl border-slate-200 text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mjesto rođenja</label>
          <input v-model="form.mjesto_rođenja" type="text" class="rounded-xl border-slate-200 text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mjesto pogibije</label>
          <input v-model="form.mjesto_pogibije" type="text" class="rounded-xl border-slate-200 text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">URL fotografije</label>
          <input v-model="form.fotka_url" type="url" class="rounded-xl border-slate-200 text-sm" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Jedinica</label>
          <input v-model="form.jedinica" type="text" class="rounded-xl border-slate-200 text-sm" />
        </div>
        <div class="sm:col-span-2 flex items-center gap-3">
          <button type="submit" class="btn-primary" :disabled="loading">{{ editingId ? 'Spremi promjene' : 'Dodaj' }}</button>
          <button type="button" class="btn-secondary" @click="resetForm">Reset</button>
        </div>
      </form>
    </section>

    <section>
      <div v-if="loading" class="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">Učitavanje…</div>
      <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">{{ error }}</div>
      <div v-else class="overflow-hidden rounded-2xl border border-slate-200">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-4 py-3 text-left">Ime i prezime</th>
              <th class="px-4 py-3 text-left">God.</th>
              <th class="px-4 py-3 text-left">Jedinica</th>
              <th class="px-4 py-3 text-left">Akcije</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 bg-white">
            <tr v-for="defender in defenders" :key="defender.id" class="hover:bg-slate-50">
              <td class="px-4 py-3 text-slate-800">{{ defender.ime }} {{ defender.prezime }}</td>
              <td class="px-4 py-3 text-slate-500">
                {{ defender.godina_rođenja || '—' }} / {{ defender.godina_pogibije || '—' }}
              </td>
              <td class="px-4 py-3 text-slate-500">{{ defender.jedinica || '—' }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button type="button" class="btn-secondary px-3 py-1 text-xs" @click="editDefender(defender)">Uredi</button>
                  <button type="button" class="btn-secondary px-3 py-1 text-xs text-rose-600" @click="deleteDefender(defender.id)">
                    Briši
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

