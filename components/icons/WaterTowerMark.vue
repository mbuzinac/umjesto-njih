<template>
  <svg
    class="h-full w-full"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Vukovarski vodotoranj"
  >
    <defs>
      <clipPath id="tower-circle">
        <circle cx="32" cy="32" r="28" />
      </clipPath>
    </defs>
    <circle cx="32" cy="32" r="30" fill="#ffffff" stroke="#0b2f6b" stroke-width="2" opacity="0.9" />
    <g clip-path="url(#tower-circle)">
      <rect x="4" y="4" width="56" height="56" rx="28" fill="#0b2f6b" />
      <image
        x="10"
        y="8"
        width="44"
        height="52"
        href="/icons/vukovar-tower-white-64.png"
        preserveAspectRatio="xMidYMin meet"
      />
    </g>
  </svg>
</template>


