<script setup lang="ts">
import type { Defender } from '~/types/models'

const props = defineProps<{ defender: Defender }>()
</script>

<template>
  <article class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <div class="relative h-52 w-full overflow-hidden bg-slate-100">
      <img
        v-if="props.defender.fotka_url"
        :src="props.defender.fotka_url"
        :alt="`${props.defender.ime} ${props.defender.prezime}`"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div v-else class="flex h-full items-center justify-center text-5xl font-semibold text-slate-300">
        {{ props.defender.ime.charAt(0) }}{{ props.defender.prezime.charAt(0) }}
      </div>
      <div class="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary shadow">
        {{ props.defender.jedinica || 'Jednica nepoznata' }}
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-3 p-5">
      <header>
        <h3 class="text-xl font-semibold text-slate-900">
          {{ props.defender.ime }} {{ props.defender.prezime }}
        </h3>
        <p class="text-sm text-slate-500">
          {{ props.defender.godina_rođenja || '????' }} — {{ props.defender.godina_pogibije || '????' }}
        </p>
      </header>
      <dl class="grid grid-cols-2 gap-2 text-xs text-slate-500">
        <div>
          <dt class="font-semibold text-slate-700">Rođen</dt>
          <dd>{{ props.defender.mjesto_rođenja || 'Nepoznato' }}</dd>
        </div>
        <div>
          <dt class="font-semibold text-slate-700">Poginuo</dt>
          <dd>{{ props.defender.mjesto_pogibije || 'Nepoznato' }}</dd>
        </div>
      </dl>
      <div class="mt-auto pt-4">
        <NuxtLink :to="`/branitelji/${props.defender.id}`" class="btn-secondary w-full">Pogledaj profil</NuxtLink>
      </div>
    </div>
  </article>
</template>

