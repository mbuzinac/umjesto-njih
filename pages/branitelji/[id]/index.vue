<script setup lang="ts">
import { computed } from 'vue'
import { createError, useFetch, useRoute } from 'nuxt/app'
import type { Defender } from '~/types/models'
import { useMemories } from '~/composables/useMemories'
import { DEFENDER_PLACEHOLDER_IMAGE } from '~/constants/images'

const route = useRoute()
const id = route.params.id as string

const { data: defender, error, pending } = await useFetch<Defender>(`/api/defenders/${id}`)

if (!defender.value && error.value) {
  throw createError({ statusCode: 404, statusMessage: 'Branitelj nije pronađen.' })
}

const { memories, loading: memoriesLoading, fetchMemories } = useMemories(id)

await fetchMemories()

const imageSrc = computed(() => {
  const rawUrl = (defender.value?.fotka_url || '').trim()
  return rawUrl.length ? rawUrl : DEFENDER_PLACEHOLDER_IMAGE
})

const isPlaceholder = computed(() => imageSrc.value === DEFENDER_PLACEHOLDER_IMAGE)

const initials = computed(() => {
  const first = defender.value?.ime?.charAt(0) ?? ''
  const last = defender.value?.prezime?.charAt(0) ?? ''
  return `${first}${last}`.trim()
})
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
      <div class="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <img
          :src="imageSrc"
          :alt="`${defender.ime} ${defender.prezime}`"
          class="h-96 w-full object-cover"
          :class="{
            'object-top brightness-125 contrast-90 saturate-75 opacity-90': isPlaceholder,
          }"
          loading="lazy"
        />
        <div
          v-if="isPlaceholder"
          class="absolute inset-0 bg-white/55 backdrop-blur-[2px]"
          aria-hidden="true"
        />
        <div
          v-if="isPlaceholder && initials"
          class="absolute inset-0 flex items-center justify-center text-6xl font-semibold text-primary/80 drop-shadow-sm"
          aria-hidden="true"
        >
          {{ initials }}
        </div>
      </div>
      <div class="space-y-6">
        <div class="space-y-2">
          <NuxtLink to="/branitelji" class="text-sm text-primary">&larr; Povratak na popis</NuxtLink>
          <h1 class="text-4xl font-bold text-slate-900">
            {{ defender.ime }} {{ defender.prezime }}
          </h1>
          <ClientOnly>
            <template #fallback>
              <p class="text-lg text-slate-600">
                {{ defender.godina_rođenja ?? '—' }} — {{ defender.godina_pogibije ?? '—' }}
              </p>
            </template>
            <p
              class="text-lg text-slate-600"
              v-tooltip.bottom="`Godina rođenja: ${defender.godina_rođenja || 'n/a'} • Godina pogibije: ${defender.godina_pogibije || 'n/a'}`"
            >
              {{ defender.godina_rođenja ?? '—' }} — {{ defender.godina_pogibije ?? '—' }}
            </p>
          </ClientOnly>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <dl class="grid gap-4 sm:grid-cols-2">
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mjesto rođenja</dt>
              <ClientOnly>
                <template #fallback>
                  <dd class="text-base text-slate-800">
                    {{ defender.mjesto_rođenja || '—' }}
                  </dd>
                </template>
                <dd
                  class="text-base text-slate-800"
                  v-tooltip.bottom="defender.mjesto_rođenja ? `Mjesto rođenja: ${defender.mjesto_rođenja}` : 'Mjesto rođenja nepoznato'"
                >
                  {{ defender.mjesto_rođenja || '—' }}
                </dd>
              </ClientOnly>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mjesto pogibije</dt>
              <ClientOnly>
                <template #fallback>
                  <dd class="text-base text-slate-800">
                    {{ defender.mjesto_pogibije || '—' }}
                  </dd>
                </template>
                <dd
                  class="text-base text-slate-800"
                  v-tooltip.bottom="defender.mjesto_pogibije ? `Mjesto pogibije: ${defender.mjesto_pogibije}` : 'Mjesto pogibije nepoznato'"
                >
                  {{ defender.mjesto_pogibije || '—' }}
                </dd>
              </ClientOnly>
            </div>
            <div>
              <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Jedinica</dt>
              <ClientOnly>
                <template #fallback>
                  <dd class="text-base text-slate-800">
                    {{ defender.jedinica || '—' }}
                  </dd>
                </template>
                <dd
                  class="text-base text-slate-800"
                  v-tooltip.bottom="defender.jedinica ? `Jedinica: ${defender.jedinica}` : 'Jedinica nepoznata'"
                >
                  {{ defender.jedinica || '—' }}
                </dd>
              </ClientOnly>
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

