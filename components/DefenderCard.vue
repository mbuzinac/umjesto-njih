<script setup lang="ts">
import { computed } from 'vue'
import { DEFENDER_PLACEHOLDER_IMAGE } from '~/constants/images'
import type { Defender } from '~/types/models'

const props = defineProps<{ defender: Defender }>()

const statusLabel = computed(() => {
  switch (props.defender.status) {
    case 'missing':
      return 'Nestao'
    case 'found':
      return 'Pronađen'
    default:
      return null
  }
})

const imageSrc = computed(() => {
  const rawUrl = (props.defender.fotka_url || '').trim()
  return rawUrl.length ? rawUrl : DEFENDER_PLACEHOLDER_IMAGE
})

const isPlaceholder = computed(() => imageSrc.value === DEFENDER_PLACEHOLDER_IMAGE)

const initials = computed(() => {
  const first = props.defender.ime?.charAt(0) ?? ''
  const last = props.defender.prezime?.charAt(0) ?? ''
  return `${first}${last}`.trim()
})
</script>

<template>
  <article class="group flex flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white/95 shadow-lg shadow-primary/10 transition hover:-translate-y-1 hover:shadow-primary/20">
    <div class="relative h-56 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
      <img
        :src="imageSrc"
        :alt="`${props.defender.ime} ${props.defender.prezime}`"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
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
        class="absolute inset-0 flex items-center justify-center text-5xl font-semibold text-primary/80 drop-shadow-sm"
        aria-hidden="true"
      >
        {{ initials }}
      </div>
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent p-4 text-white">
        <p class="text-xs uppercase tracking-[0.3em] text-white/70">Jedinica</p>
        <p class="text-sm font-semibold">{{ props.defender.jedinica || 'Jedinica nepoznata' }}</p>
      </div>
      <span
        v-if="statusLabel"
        class="absolute right-4 top-4 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-secondary/30"
      >
        {{ statusLabel }}
      </span>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-6">
      <header>
        <h3 class="text-xl font-semibold text-primary">
          {{ props.defender.ime }} {{ props.defender.prezime }}
        </h3>
        <ClientOnly>
          <template #fallback>
            <p class="text-sm text-navy/60">
              {{ props.defender.godina_rođenja ?? '—' }} — {{ props.defender.godina_pogibije ?? '—' }}
            </p>
          </template>
          <p
            class="text-sm text-navy/60"
            v-tooltip.bottom="`Godina rođenja: ${props.defender.godina_rođenja || 'n/a'} • Godina pogibije: ${props.defender.godina_pogibije || 'n/a'}`"
          >
            {{ props.defender.godina_rođenja ?? '—' }} — {{ props.defender.godina_pogibije ?? '—' }}
          </p>
        </ClientOnly>
      </header>
      <dl class="grid grid-cols-2 gap-2 text-xs text-navy/60">
        <div>
          <dt class="font-semibold text-primary/80">Rođen</dt>
          <ClientOnly>
            <template #fallback>
              <dd>
                {{ props.defender.mjesto_rođenja || '—' }}
              </dd>
            </template>
            <dd v-tooltip.bottom="props.defender.mjesto_rođenja ? `Mjesto rođenja: ${props.defender.mjesto_rođenja}` : 'Mjesto rođenja nepoznato'">
              {{ props.defender.mjesto_rođenja || '—' }}
            </dd>
          </ClientOnly>
        </div>
        <div>
          <dt class="font-semibold text-primary/80">Poginuo</dt>
          <ClientOnly>
            <template #fallback>
              <dd>
                {{ props.defender.mjesto_pogibije || '—' }}
              </dd>
            </template>
            <dd v-tooltip.bottom="props.defender.mjesto_pogibije ? `Mjesto pogibije: ${props.defender.mjesto_pogibije}` : 'Mjesto pogibije nepoznato'">
              {{ props.defender.mjesto_pogibije || '—' }}
            </dd>
          </ClientOnly>
        </div>
      </dl>
      <div class="mt-auto pt-4">
        <NuxtLink :to="`/branitelji/${props.defender.id}`" class="btn-secondary w-full">
          Pogledaj profil
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

