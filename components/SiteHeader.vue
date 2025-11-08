<script setup lang="ts">
import WaterTowerMark from '~/components/icons/WaterTowerMark.vue'
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/30 bg-white/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="group flex items-center gap-3 text-lg font-semibold text-primary">
        <span class="inline-flex h-12 w-12 items-center justify-center drop-shadow-md">
          <WaterTowerMark class="h-12 w-12" />
        </span>
        <div class="leading-tight">
          <span class="block text-sm uppercase tracking-[0.3em] text-primary/60">Vukovar</span>
          <span class="block text-xl font-bold text-primary group-hover:text-[#0c3b85]">Umjesto Njih</span>
        </div>
      </NuxtLink>
      <nav class="flex items-center gap-6 text-sm font-medium text-navy/70">
        <NuxtLink to="/" class="transition hover:text-primary">Početna</NuxtLink>
        <NuxtLink to="/branitelji" class="transition hover:text-primary">Branitelji</NuxtLink>
        <NuxtLink to="/admin" class="transition hover:text-primary">Admin</NuxtLink>
      </nav>
    </div>
  </header>
</template>

