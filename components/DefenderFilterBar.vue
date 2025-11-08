<script setup lang="ts">
import { computed, ref } from 'vue'
import Dialog from 'primevue/dialog'
import { CROATIAN_UNITS } from '~/constants/croatianUnits'
import type { Defender } from '~/types/models'

const props = defineProps<{
  filters: {
    query?: string
    jedinica?: string | null
    godina_pogibije?: number | null
    status?: string | null
  }
  defenders: Defender[]
  years?: number[]
}>()

const emit = defineEmits<{
  reset: []
}>()

const unitOptions = computed(() => {
  const units = new Set<string>(CROATIAN_UNITS)
  props.defenders.forEach((defender) => {
    if (defender.jedinica) {
      units.add(defender.jedinica)
    }
  })
  return Array.from(units)
    .filter((unit) => unit.trim().length)
    .sort((a, b) => a.localeCompare(b, 'hr-HR'))
})

const yearOptions = computed(() => {
  if (props.years?.length) {
    return [...props.years].sort((a, b) => a - b)
  }
  const years = new Set<number>()
  props.defenders.forEach((defender) => {
    if (defender.godina_pogibije) {
      years.add(defender.godina_pogibije)
    }
  })
  return Array.from(years).sort((a, b) => a - b)
})

const BASE_STATUSES = ['missing', 'found']
const STATUS_LABELS: Record<string, string> = {
  missing: 'Nestao',
  found: 'Pronađen'
}

const statusOptions = computed(() => {
  const statuses = new Set<string>(BASE_STATUSES)
  props.defenders.forEach((defender) => {
    if (defender.status) {
      statuses.add(defender.status)
    }
  })
  return Array.from(statuses).sort((a, b) => a.localeCompare(b, 'hr-HR'))
})

const resetFilters = () => {
  emit('reset')
}

const showFilters = ref(false)

const openFilters = () => {
  showFilters.value = true
}

const closeFilters = () => {
  showFilters.value = false
}

const hasAdditionalFilters = computed(() => {
  return Boolean(
    props.filters.status ||
      props.filters.jedinica ||
      (props.filters.godina_pogibije !== null && props.filters.godina_pogibije !== undefined)
  )
})
</script>

<template>
  <div class="filter-card">
    <div class="flex flex-wrap items-end gap-3">
      <div class="flex min-w-[240px] flex-1 flex-col gap-2">
        <label class="text-xs font-semibold uppercase tracking-wide text-primary/70">Traži branitelja</label>
        <div class="relative">
          <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-primary/40">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
            </svg>
          </span>
          <input v-model="filters.query" type="search" placeholder="Ime ili prezime" class="input-field input-field--with-icon" />
        </div>
      </div>
      <button
        type="button"
        class="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-white text-primary shadow-sm transition hover:border-primary/30 hover:text-primary/80"
        v-tooltip.bottom="hasAdditionalFilters ? 'Dodatni filteri aktivni' : 'Otvori dodatne filtere'"
        @click="openFilters"
        aria-label="Dodatni filteri"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M10 18h4" />
        </svg>
        <span
          v-if="hasAdditionalFilters"
          class="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-secondary shadow"
        ></span>
      </button>
    </div>
    <Dialog
      v-model:visible="showFilters"
      modal
      header="Dodatni filteri"
      class="w-full sm:w-3/4 md:w-1/2"
      :dismissableMask="true"
      @hide="closeFilters"
    >
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-primary/70">Status</label>
          <div class="relative">
            <select v-model="filters.status" class="select-field py-2">
              <option :value="null">Svi statusi</option>
              <option value="missing">{{ STATUS_LABELS.missing }}</option>
              <option value="found">{{ STATUS_LABELS.found }}</option>
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ STATUS_LABELS[status] ?? status }}
              </option>
            </select>
            <span class="select-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-primary/70">Jedinica</label>
          <div class="relative">
            <select v-model="filters.jedinica" class="select-field py-2">
              <option :value="null">Sve jedinice</option>
              <option v-for="unit in unitOptions" :key="unit" :value="unit">
                {{ unit }}
              </option>
            </select>
            <span class="select-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-primary/70">Godina pogibije</label>
          <div class="relative">
            <select v-model="filters.godina_pogibije" class="select-field py-2">
              <option :value="null">Sve godine</option>
              <option v-for="year in yearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <span class="select-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div class="mt-6 flex flex-col gap-3 border-t border-primary/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <span class="text-xs text-primary/60">Koristi reset za početne vrijednosti filtera.</span>
        <div class="flex gap-2">
          <button type="button" class="btn-secondary" @click="resetFilters">Resetiraj</button>
          <button type="button" class="btn-primary" @click="closeFilters">Primijeni</button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

