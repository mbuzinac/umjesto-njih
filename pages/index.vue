<script setup lang="ts">
import { useFetch } from 'nuxt/app'
const { data: countData, pending } = await useFetch<{ total: number }>('/api/defenders/count')
</script>

<template>
  <div class="flex flex-col gap-16">
    <section class="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-6">
        <span class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          Sjećanje na hrabrost
        </span>
        <h1 class="text-4xl font-bold text-slate-900 sm:text-5xl">Umjesto njih – digitalna memorija hrvatskih branitelja</h1>
        <p class="text-lg text-slate-600">
          Zabilježimo imena, priče i žrtvu onih koji su dali najviše. Platforma okuplja dokumente,
          fotografije i sjećanja kako bi buduće generacije znale tko su bili.
        </p>
        <div class="flex flex-wrap gap-4">
          <NuxtLink to="/branitelji" class="btn-primary">Pregledaj branitelje</NuxtLink>
          <NuxtLink to="/admin" class="btn-secondary">Admin prijava</NuxtLink>
        </div>
      </div>
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-slate-900 p-10 text-white shadow-xl">
        <div class="space-y-6">
          <p class="text-sm uppercase tracking-[0.3em] text-white/70">Zajedničko sjećanje</p>
          <p class="text-4xl font-semibold">
            {{ pending ? '…' : countData?.total ?? 0 }}<span class="block text-base font-normal text-white/70">zabilježenih branitelja</span>
          </p>
          <p class="text-white/80">
            Broj se ažurira u stvarnom vremenu na temelju unosa ovlaštenog tima i potvrđenih svjedočanstava.
          </p>
        </div>
      </div>
    </section>

    <section class="grid gap-6 rounded-3xl bg-white p-10 shadow-lg shadow-slate-900/5 sm:grid-cols-2">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Kolekcija priča i podataka</h2>
        <p class="text-slate-600">
          Svaki profil sadrži osnovne biografske podatke, fotografije te odobrena sjećanja suboraca, obitelji i prijatelja.
        </p>
      </div>
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold">Siguran i odgovoran pristup</h2>
        <p class="text-slate-600">
          Administratorski tim pregledava svako novo sjećanje prije objave. Materijali se pohranjuju u sigurnom oblaku.
        </p>
      </div>
    </section>
  </div>
</template>

