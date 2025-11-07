<template>
  <header class="border-b border-slate-200 bg-white/90 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg font-semibold text-primary">
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-base font-bold">UN</span>
        <span>Umjesto njih</span>
      </NuxtLink>
      <nav class="flex items-center gap-4 text-sm font-medium">
        <NuxtLink to="/" class="hover:text-primary">Početna</NuxtLink>
        <NuxtLink to="/branitelji" class="hover:text-primary">Branitelji</NuxtLink>
        <NuxtLink to="/admin" class="hover:text-primary">Admin</NuxtLink>
      </nav>
    </div>
  </header>
</template>

