<script setup lang="ts">
import { useDefenders } from '~/composables/useDefenders'
const { defenders, filteredDefenders, filters, fetchDefenders, loading, error } = useDefenders()

await fetchDefenders()

const resetFilters = () => {
  filters.ime = ''
  filters.prezime = ''
  filters.jedinica = ''
  filters.godina_pogibije = undefined
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <header class="flex flex-col gap-4">
      <div class="space-y-2">
        <h1 class="text-3xl font-semibold text-slate-900 sm:text-4xl">Branitelji</h1>
        <p class="max-w-3xl text-slate-600">
          Pregled svih zabilježenih branitelja. Koristi filtre za bržu pretragu prema imenu, jedinici ili godini pogibije.
        </p>
      </div>
    </header>

    <DefenderFilterBar :filters="filters" :defenders="defenders" @reset="resetFilters" />

    <section>
      <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Učitavanje podataka…
      </div>
      <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">
        {{ error }}
      </div>
      <div v-else>
        <p class="mb-4 text-sm text-slate-500">
          Prikazano {{ filteredDefenders.length }} od {{ defenders.length }} branitelja.
        </p>
        <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <DefenderCard v-for="defender in filteredDefenders" :key="defender.id" :defender="defender" />
        </div>
        <div v-if="!filteredDefenders.length" class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
          Nema rezultata za odabrane kriterije.
        </div>
      </div>
    </section>
  </div>
</template>

