<script setup lang="ts">
import { computed } from 'vue'
import type { Defender } from '~/types/models'

const props = defineProps<{
  filters: {
    ime?: string
    prezime?: string
    jedinica?: string
    godina_pogibije?: number | null
  }
  defenders: Defender[]
}>()

const emit = defineEmits<{
  reset: []
}>()

const uniqueUnits = computed(() => {
  const units = new Set<string>()
  props.defenders.forEach((defender) => {
    if (defender.jedinica) {
      units.add(defender.jedinica)
    }
  })
  return Array.from(units).sort()
})

const uniqueYears = computed(() => {
  const years = new Set<number>()
  props.defenders.forEach((defender) => {
    if (defender.godina_pogibije) {
      years.add(defender.godina_pogibije)
    }
  })
  return Array.from(years).sort((a, b) => a - b)
})

const resetFilters = () => {
  emit('reset')
}
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Ime</label>
        <input v-model="filters.ime" type="text" placeholder="Pretraži ime" class="rounded-xl border-slate-200 text-sm" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Prezime</label>
        <input v-model="filters.prezime" type="text" placeholder="Pretraži prezime" class="rounded-xl border-slate-200 text-sm" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Jedinica</label>
        <select v-model="filters.jedinica" class="rounded-xl border-slate-200 text-sm">
          <option value="">Sve jedinice</option>
          <option v-for="unit in uniqueUnits" :key="unit" :value="unit">{{ unit }}</option>
        </select>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Godina pogibije</label>
        <select v-model="filters.godina_pogibije" class="rounded-xl border-slate-200 text-sm">
          <option :value="undefined">Sve godine</option>
          <option v-for="year in uniqueYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>
    <div class="mt-4 flex justify-end">
      <button type="button" class="btn-secondary" @click="resetFilters">Resetiraj filtre</button>
    </div>
  </div>
</template>

