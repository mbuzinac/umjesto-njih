<script setup lang="ts">
import type { Memory } from '~/types/models'

const props = defineProps<{ memories: Memory[] }>()
</script>

<template>
  <div class="space-y-4">
    <article
      v-for="memory in props.memories"
      :key="memory.id"
      class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <header class="mb-3 flex items-center justify-between">
        <div>
          <p class="text-sm font-semibold text-slate-900">{{ memory.ime_autora }}</p>
          <p class="text-xs text-slate-500">{{ new Date(memory.created_at).toLocaleDateString('hr-HR') }}</p>
        </div>
        <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Odobreno</span>
      </header>
      <p class="text-slate-700">{{ memory.poruka }}</p>
      <div v-if="memory.slika_url" class="mt-4 overflow-hidden rounded-xl">
        <img :src="memory.slika_url" alt="Sjećanje" class="w-full object-cover" />
      </div>
    </article>

    <p v-if="!props.memories.length" class="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500">
      Još nema odobrenih sjećanja. Budi prvi koji će ostaviti trag.
    </p>
  </div>
</template>

