<template>
  <div class="relative">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(242,102,47,0.08),_transparent_55%)]"></div>
    <SiteHeader />
    <main class="mx-auto w-full max-w-6xl px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

