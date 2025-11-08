<script setup lang="ts">
import { computed } from 'vue'
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
</script>

<template>
  <div class="filter-card">
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-3 lg:flex-nowrap">
        <div class="flex flex-1 flex-col gap-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-primary/70">Traži branitelja</label>
          <div class="relative">
            <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-primary/40">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
              </svg>
            </span>
            <input
              v-model="filters.query"
              type="search"
              placeholder="Ime ili prezime"
              class="input-field input-field--with-icon"
            />
          </div>
        </div>

        <div class="flex w-full flex-col gap-2 lg:w-auto">
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

        <div class="flex w-full flex-col gap-2 lg:w-auto">
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

        <div class="flex w-full flex-col gap-2 lg:w-auto">
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

        <div class="flex w-full items-end lg:w-auto">
          <button type="button" class="btn-secondary w-full justify-center lg:h-[44px] lg:px-10" @click="resetFilters">
            Resetiraj
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

