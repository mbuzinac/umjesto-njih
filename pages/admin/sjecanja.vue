<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Memory } from '~/types/models'
import { useAdminAuth } from '~/composables/useAdminAuth'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const statusFilter = ref<'pending' | 'approved' | 'rejected' | 'all'>('pending')
const memories = ref<Memory[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const { adminFetch } = useAdminAuth()

const loadMemories = async () => {
  loading.value = true
  error.value = null
  try {
    const query = statusFilter.value === 'all' ? '' : `?status=${statusFilter.value}`
    memories.value = await adminFetch<Memory[]>(`/api/memories${query}`)
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

watch(statusFilter, () => {
  loadMemories()
})

const updateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
  loading.value = true
  error.value = null
  try {
    await adminFetch(`/api/memories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
    await loadMemories()
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

const deleteMemory = async (id: string) => {
  if (!confirm('Obrisati sjećanje?')) {
    return
  }
  loading.value = true
  error.value = null
  try {
    await adminFetch(`/api/memories/${id}`, { method: 'DELETE' })
    await loadMemories()
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMemories()
})
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Sjećanja</h1>
        <p class="text-sm text-slate-500">Pregledaj i odobri sjećanja prije javne objave.</p>
      </div>
      <select v-model="statusFilter" class="rounded-xl border-slate-200 text-sm">
        <option value="pending">Na čekanju</option>
        <option value="approved">Odobreno</option>
        <option value="rejected">Odbijeno</option>
        <option value="all">Sva</option>
      </select>
    </header>

    <section>
      <div v-if="loading" class="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">Učitavanje…</div>
      <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">{{ error }}</div>
      <div v-else class="space-y-4">
        <article
          v-for="memory in memories"
          :key="memory.id"
          class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <header class="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="font-semibold text-slate-900">{{ memory.ime_autora }}</p>
              <p class="text-xs text-slate-500">
                {{ new Date(memory.created_at).toLocaleString('hr-HR') }} • Branitelj: {{ memory.branitelj_id }}
              </p>
            </div>
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="{
                'bg-amber-100 text-amber-700': memory.status === 'pending',
                'bg-emerald-100 text-emerald-700': memory.status === 'approved',
                'bg-rose-100 text-rose-700': memory.status === 'rejected'
              }"
            >
              {{ memory.status }}
            </span>
          </header>
          <p class="text-slate-700">{{ memory.poruka }}</p>
          <div v-if="memory.slika_url" class="mt-4 overflow-hidden rounded-xl">
            <img :src="memory.slika_url" alt="Sjećanje" class="w-full max-w-md object-cover" />
          </div>
          <footer class="mt-4 flex flex-wrap gap-2 text-sm">
            <button v-if="memory.status !== 'approved'" type="button" class="btn-primary px-4 py-2" @click="updateStatus(memory.id, 'approved')">
              Odobri
            </button>
            <button v-if="memory.status !== 'rejected'" type="button" class="btn-secondary px-4 py-2" @click="updateStatus(memory.id, 'rejected')">
              Odbij
            </button>
            <button type="button" class="btn-secondary px-4 py-2 text-rose-600" @click="deleteMemory(memory.id)">Briši</button>
          </footer>
        </article>
        <p v-if="!memories.length" class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Nema sjećanja za odabrani filter.
        </p>
      </div>
    </section>
  </div>
</template>

