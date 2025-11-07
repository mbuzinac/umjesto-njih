<script setup lang="ts">
import { createError, useFetch, useRoute } from 'nuxt/app'
import type { Defender } from '~/types/models'

const route = useRoute()
const id = route.params.id as string

const { data: defender, error, pending } = await useFetch<Defender>(`/api/defenders/${id}`)

if (!defender.value && error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Branitelj nije pronađen.' })
}
</script>

<template>
  <div v-if="pending" class="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
    Učitavanje podataka…
  </div>
  <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-700">
    {{ error.statusMessage }}
  </div>
  <div v-else-if="defender" class="flex flex-col gap-10">
    <header class="space-y-2">
      <NuxtLink :to="`/branitelji/${defender.id}`" class="text-sm text-primary">&larr; Povratak na profil</NuxtLink>
      <h1 class="text-3xl font-semibold text-slate-900">Dodaj sjećanje na {{ defender.ime }} {{ defender.prezime }}</h1>
      <p class="text-slate-600">Svako sjećanje provjerava administrator prije objave.</p>
    </header>

    <section class="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <AddMemoryForm :defender-id="defender.id" />
    </section>
  </div>
</template>

