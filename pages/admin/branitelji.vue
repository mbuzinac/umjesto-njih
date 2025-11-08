<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import type { Defender } from '~/types/models'
import { useAdminAuth } from '~/composables/useAdminAuth'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const defenders = ref<Defender[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const editingId = ref<string | null>(null)
const currentPage = ref(1)
const pageSize = ref(18)
const total = ref(0)
const searchQuery = ref('')
const showFormModal = ref(false)
const showDeleteDialog = ref(false)
const defenderToDelete = ref<Defender | null>(null)
const modalTitle = computed(() => (editingId.value ? 'Uredi branitelja' : 'Dodaj novog branitelja'))

let searchDebounce: ReturnType<typeof setTimeout> | null = null

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

const openCreateModal = () => {
  resetForm()
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
}

const { adminFetch } = useAdminAuth()

const loadDefenders = async () => {
  loading.value = true
  error.value = null
  try {
    const params = new URLSearchParams({
      page: String(currentPage.value),
      pageSize: String(pageSize.value)
    })
    const trimmedQuery = searchQuery.value.trim()
    if (trimmedQuery) {
      params.set('q', trimmedQuery)
    }
    const response = await adminFetch<{
      items: Defender[]
      total: number
      page: number
      pageSize: number
    }>(`/api/defenders?${params.toString()}`)
    const maxPage = response.total ? Math.ceil(response.total / response.pageSize) : 1
    if (response.page > maxPage && maxPage !== currentPage.value) {
      currentPage.value = Math.max(1, maxPage)
      await loadDefenders()
      return
    }
    defenders.value = response.items
    total.value = response.total
    if (response.page !== currentPage.value) {
      currentPage.value = response.page
    }
    if (response.pageSize !== pageSize.value) {
      pageSize.value = response.pageSize
    }
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

watch(searchQuery, () => {
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }
  searchDebounce = setTimeout(() => {
    if (currentPage.value !== 1) {
      currentPage.value = 1
    }
    loadDefenders()
  }, 300)
})

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
    closeFormModal()
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
  showFormModal.value = true
}

const promptDelete = (defender: Defender) => {
  defenderToDelete.value = defender
  showDeleteDialog.value = true
}

const cancelDelete = () => {
  defenderToDelete.value = null
  showDeleteDialog.value = false
}

const performDelete = async () => {
  if (!defenderToDelete.value) {
    return
  }
  loading.value = true
  error.value = null
  try {
    await adminFetch(`/api/defenders/${defenderToDelete.value.id}`, { method: 'DELETE' })
    await loadDefenders()
    cancelDelete()
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

const totalPages = computed(() => (total.value ? Math.ceil(total.value / pageSize.value) : 1))

const from = computed(() => {
  if (!total.value) {
    return 0
  }
  return (currentPage.value - 1) * pageSize.value + 1
})

const to = computed(() => {
  if (!total.value) {
    return 0
  }
  return Math.min(currentPage.value * pageSize.value, total.value)
})

const handlePageChange = (event: { page: number; rows: number }) => {
  const nextPage = event.page + 1
  const nextPageSize = event.rows
  if (currentPage.value !== nextPage || pageSize.value !== nextPageSize) {
    currentPage.value = nextPage
    pageSize.value = nextPageSize
    loadDefenders()
  }
}

onMounted(() => {
  loadDefenders()
})

onBeforeUnmount(() => {
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="rounded-3xl border border-primary/10 bg-white/95 p-6 shadow-lg shadow-primary/10">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div class="space-y-2">
          <span class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Admin
          </span>
          <div class="space-y-1">
            <h1 class="text-2xl font-bold text-primary sm:text-3xl">Upravljanje braniteljima</h1>
            <p class="text-sm text-primary/70">Dodaj, ažuriraj ili obriši zapise branitelja.</p>
          </div>
        </div>
        <div class="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-end md:gap-5">
          <div class="flex min-w-[260px] flex-1 flex-col gap-2">
            <label class="text-xs font-semibold uppercase tracking-wide text-primary/70">Traži branitelja</label>
            <div class="relative">
              <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-primary/40">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                </svg>
              </span>
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Ime ili prezime"
                class="input-field input-field--with-icon"
              />
            </div>
          </div>
          <button type="button" class="btn-primary w-full md:w-auto" @click="openCreateModal">
            Dodaj branitelja
          </button>
        </div>
      </div>
    </header>

    <section>
      <div v-if="loading" class="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">Učitavanje…</div>
      <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">{{ error }}</div>
      <div v-else class="rounded-2xl border border-slate-200">
        <div class="flex flex-col gap-2 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs uppercase tracking-wide text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Prikazano
            <strong>{{ from }}–{{ to }}</strong>
            od <strong>{{ total }}</strong> zapisa
          </span>
          <span class="font-semibold text-slate-600">Stranica {{ currentPage }} / {{ totalPages }}</span>
        </div>
        <div class="overflow-x-auto">
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
              <tr v-if="!defenders.length">
                <td colspan="4" class="px-4 py-6 text-center text-slate-500">Nema dostupnih zapisa.</td>
              </tr>
              <tr v-for="defender in defenders" :key="defender.id" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-slate-800">{{ defender.ime }} {{ defender.prezime }}</td>
                <td class="px-4 py-3 text-slate-500">
                  {{ defender.godina_rođenja || '—' }} / {{ defender.godina_pogibije || '—' }}
                </td>
                <td class="px-4 py-3 text-slate-500">{{ defender.jedinica || '—' }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button type="button" class="btn-secondary px-3 py-1 text-xs" @click="editDefender(defender)">Uredi</button>
                    <button
                      type="button"
                      class="btn-secondary px-3 py-1 text-xs text-rose-600"
                      @click="promptDelete(defender)"
                    >
                      Briši
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="total" class="flex justify-center border-t border-slate-200 bg-white px-4 py-3">
          <Paginator
            :first="(currentPage - 1) * pageSize"
            :rows="pageSize"
            :totalRecords="total"
            :rowsPerPageOptions="[18, 36, 54, 72]"
            @page="handlePageChange"
          />
        </div>
      </div>
    </section>

    <Dialog v-model:visible="showFormModal" modal :header="modalTitle" class="w-full sm:w-2/3 lg:w-1/2" @hide="resetForm">
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
        <div class="sm:col-span-2 mt-2 flex items-center justify-end gap-3">
          <button type="button" class="btn-secondary" @click="closeFormModal">Odustani</button>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ editingId ? 'Spremi promjene' : 'Dodaj' }}
          </button>
        </div>
      </form>
    </Dialog>

    <Dialog v-model:visible="showDeleteDialog" modal header="Potvrda brisanja" class="w-full sm:w-80" @hide="cancelDelete">
      <p class="text-sm text-slate-600">
        Jeste li sigurni da želite obrisati
        <strong>{{ defenderToDelete ? `${defenderToDelete.ime} ${defenderToDelete.prezime}` : 'ovog branitelja' }}</strong>?
      </p>
      <template #footer>
        <button type="button" class="btn-secondary" @click="cancelDelete">Odustani</button>
        <button type="button" class="btn-secondary text-rose-600" :disabled="loading" @click="performDelete">Obriši</button>
      </template>
    </Dialog>
  </div>
</template>

