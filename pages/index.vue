<script setup lang="ts">
import { useFetch } from 'nuxt/app'
const { data: countData, pending } = await useFetch<{ total: number }>('/api/defenders/count')
</script>

<template>
  <div class="flex flex-col gap-16">
    <section class="relative overflow-hidden rounded-3xl bg-navy text-white shadow-2xl shadow-navy/30">
      <img
        src="/images/hero-vukovar.jpg"
        alt="Kolona sjećanja Vukovar"
        class="absolute inset-0 h-full w-full object-cover opacity-75"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-[#08122a]/90 via-[#0b2f6b]/85 to-[#091933]/92"></div>
      <div class="relative grid gap-10 p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
        <div class="space-y-6">
          <span class="badge-soft bg-white/10 text-white">SJEĆANJE NA VUKOVAR</span>
          <h1 class="text-4xl font-bold text-white sm:text-5xl">
            Umjesto njih – digitalna memorija vukovarskih branitelja
          </h1>
          <p class="text-base text-white/80 sm:text-lg">
            Čuvamo imena, priče i žrtvu onih koji su branili grad heroj. Svatko može ostaviti sjećanje, fotografiju
            ili poruku zahvalnosti, a ovlašteni tim brine se za vjerodostojnost svakog zapisa.
          </p>
          <div class="flex flex-wrap gap-4">
            <NuxtLink to="/branitelji" class="btn-primary">Pregledaj branitelje</NuxtLink>
            <NuxtLink to="/admin" class="btn-secondary">Admin prijava</NuxtLink>
          </div>
        </div>
        <div class="flex flex-col gap-6 rounded-3xl bg-white/10 p-8 backdrop-blur">
          <p class="text-sm uppercase tracking-[0.3em] text-white/70">Živa memorija</p>
          <p class="text-5xl font-semibold">
            {{ pending ? '…' : countData?.total ?? 0 }}
            <span class="mt-2 block text-base font-normal text-white/70">profila vukovarskih branitelja</span>
          </p>
          <div class="space-y-3 text-sm text-white/75">
            <p>Podaci nastaju suradnjom obitelji, suboraca i povjesničara.</p>
            <p>Sjećanja prolaze moderaciju kako bi ostala dostojanstvena i vjerodostojna.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-8 rounded-3xl bg-white/90 p-10 shadow-xl shadow-primary/10 lg:grid-cols-3">
      <div class="flex flex-col gap-3">
        <h2 class="text-xl font-semibold text-primary">Zašto “Umjesto njih”?</h2>
        <p class="text-sm text-navy/70">
          Branitelji su stajali umjesto nas. Ova platforma omogućuje da njihova imena nikada ne zašute,
          a da nove generacije razumiju cijenu slobode.
        </p>
      </div>
      <div class="flex flex-col gap-3">
        <h2 class="text-xl font-semibold text-primary">Sjećanja u jednome mjestu</h2>
        <p class="text-sm text-navy/70">
          Svaki profil sadrži biografiju, fotografije i odobrena svjedočanstva. Sjećanja se mogu pretraživati prema
          imenu, jedinici ili godini pogibije.
        </p>
      </div>
      <div class="flex flex-col gap-3">
        <h2 class="text-xl font-semibold text-primary">Siguran i odgovoran pristup</h2>
        <p class="text-sm text-navy/70">
          Administratori provjeravaju svako novo sjećanje prije objave. Fotografije se pohranjuju u sigurnom oblaku,
          a podaci su dostupni bez reklama i distrakcija.
        </p>
      </div>
    </section>

    <section class="grid gap-8 rounded-3xl border border-primary/10 bg-white/70 p-10 shadow-lg shadow-primary/10 lg:grid-cols-[0.8fr_1.2fr]">
      <div class="space-y-4">
        <h2 class="text-2xl font-semibold text-primary">Put sjećanja</h2>
        <p class="text-sm text-navy/70">
          Platforma prati korake kolone sjećanja – od Vukovarske bolnice, preko Trpinjske ceste do Memorijalnog groblja.
          Svaki unos podsjeća da se heroji ne zaboravljaju.
        </p>
      </div>
      <ul class="grid gap-4 text-sm text-navy/80">
        <li class="rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm shadow-primary/5">
          <strong class="text-primary">1. Prikupljanje podataka</strong>
          <p>Obitelji i suborci dostavljaju provjerljive informacije i fotografije.</p>
        </li>
        <li class="rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm shadow-primary/5">
          <strong class="text-primary">2. Moderacija i potvrda</strong>
          <p>Tim volontera potvrđuje autentičnost i osigurava dostojanstven sadržaj.</p>
        </li>
        <li class="rounded-2xl border border-primary/10 bg-white/80 p-4 shadow-sm shadow-primary/5">
          <strong class="text-primary">3. Dijeljenje i učenje</strong>
          <p>Platforma služi školama, udrugama i posjetiteljima koji obilaze Vukovar.</p>
        </li>
      </ul>
    </section>
  </div>
</template>

