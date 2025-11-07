<script setup lang="ts">
import { createError, useFetch, useRoute } from 'nuxt/app'
import type { Defender } from '~/types/models'
import { useMemories } from '~/composables/useMemories'

const route = useRoute()
const id = route.params.id as string

const { data: defender, error, pending } = await useFetch<Defender>(`/api/defenders/${id}`)

if (!defender.value && error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Branitelj nije pronađen.' })
}

const { memories, loading: memoriesLoading, fetchMemories } = useMemories(id)

await fetchMemories()
</script>

<template>
  <div v-if="pending" class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
    Učitavanje profila…
  </div>
  <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">
    {{ error.statusMessage }}
  </div>
  <div v-else-if="defender" class="flex flex-col gap-12">
    <section class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <img
          v-if="defender.fotka_url"
          :src="defender.fotka_url"
          :alt="`${defender.ime} ${defender.prezime}`"
          class="h-96 w-full object-cover"
        />
        <div v-else class="flex h-96 items-center justify-center text-6xl font-semibold text-slate-300">
          {{ defender.ime.charAt(0) }}{{ defender.prezime.charAt(0) }}
        </div>
      </div>
      <div class="space-y-6">
        <div class="space-y-2">
          <NuxtLink to="/branitelji" class="text-sm text-primary">&larr; Povratak na popis</NuxtLink>
          <h1 class="text-4xl font-bold text-slate-900">
            {{ defender.ime }} {{ defender.prezime }}
          </h1>
          <p class="text-lg text-slate-600">
            {{ defender.godina_rođenja || '????' }} — {{ defender.godina_pogibije || '????' }}
          </p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <dl class="grid gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mjesto rođenja</dt>
              <dd class="text-base text-slate-800">{{ defender.mjesto_rođenja || 'Nepoznato' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mjesto pogibije</dt>
              <dd class="text-base text-slate-800">{{ defender.mjesto_pogibije || 'Nepoznato' }}</dd>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Jedinica</dt>
              <dd class="text-base text-slate-800">{{ defender.jedinica || 'Nepoznato' }}</dd>
            </div>
          </dl>
        </div>
        <NuxtLink :to="`/branitelji/${defender.id}/dodaj-sjecanje`" class="btn-primary inline-flex w-full sm:w-auto">
          Dodaj sjećanje
        </NuxtLink>
      </div>
    </section>

    <section class="space-y-6">
      <header class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-slate-900">Sjećanja</h2>
      </header>
      <div v-if="memoriesLoading" class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
        Učitavanje sjećanja…
      </div>
      <MemoryList v-else :memories="memories" />
    </section>
  </div>
</template>

