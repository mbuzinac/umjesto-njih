<script setup lang="ts">
import { useDefenders } from '~/composables/useDefenders'
const defendersApi = useDefenders()
const defenders = defendersApi.defenders
const filters = defendersApi.filters
const currentPage = defendersApi.currentPage
const pageSize = defendersApi.pageSize
const total = (defendersApi as any).total
const totalPages = defendersApi.totalPages
const from = (defendersApi as any).from
const to = (defendersApi as any).to
const hasActiveFilters = (defendersApi as any).hasActiveFilters
const fetchDefenders = defendersApi.fetchDefenders
const loading = defendersApi.loading
const error = defendersApi.error
const availableYears = (defendersApi as any).availableYears

await fetchDefenders()

const resetFilters = () => {
  filters.query = ''
  filters.jedinica = null
  filters.godina_pogibije = null
  filters.status = null
}

const handlePageChange = (event: { page: number; rows: number }) => {
  currentPage.value = event.page + 1
  pageSize.value = event.rows
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <header class="flex flex-col gap-3 rounded-3xl border border-primary/10 bg-white/90 p-5 shadow-lg shadow-primary/10">
      <div class="flex flex-col gap-1">
        <span class="badge-soft bg-primary/10 text-primary">POPIS BRANITELJA</span>
        <div class="flex flex-wrap items-center gap-3 text-primary/70">
          <h1 class="text-2xl font-bold text-primary sm:text-3xl">Vukovarski branitelji</h1>
          <span class="text-sm italic text-primary/60">
            Traži po imenu i filtriraj prema statusu, jedinici ili godini pogibije
          </span>
        </div>
      </div>
    </header>

    <DefenderFilterBar :filters="filters" :defenders="defenders" :years="availableYears" @reset="resetFilters" />

    <section>
      <div v-if="loading" class="rounded-3xl border border-primary/10 bg-white/80 p-10 text-center text-primary/70 shadow">
        Učitavanje podataka…
      </div>
      <div v-else-if="error" class="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">
        {{ error }}
      </div>
      <div v-else>
        <div class="mb-4 flex flex-col gap-3 text-sm text-navy/60 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Prikazano
            <strong>
              {{ from }}–{{ to }}
            </strong>
            od <strong>{{ total }}</strong> rezultata.
          </span>
          <span v-if="hasActiveFilters" class="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-secondary">
            Filtri su aktivni.
          </span>
        </div>
        <div class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <DefenderCard v-for="defender in defenders" :key="defender.id" :defender="defender" />
        </div>
        <div v-if="!total" class="rounded-3xl border border-primary/10 bg-white/80 p-10 text-center text-navy/60 shadow-inner">
          Nema rezultata za odabrane kriterije.
        </div>
        <div v-else class="mt-8 flex justify-center">
          <Paginator
            :first="(currentPage - 1) * pageSize"
            :rows="pageSize"
            :totalRecords="total"
            :rowsPerPageOptions="[9, 18, 27, 36]"
            @page="handlePageChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

