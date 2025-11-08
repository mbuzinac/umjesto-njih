<template>
  <svg
    class="h-full w-full"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Vukovarski vodotoranj"
  >
    <defs>
      <filter id="tower-clean" color-interpolation-filters="sRGB">
        <feColorMatrix
          type="matrix"
          values="
            -1 0 0 0 1
             0 -1 0 0 1
             0 0 -1 0 1
             0 0 0 1 0
          "
        />
        <feColorMatrix type="hueRotate" values="180" />
        <feColorMatrix type="saturate" values="1.4" />
      </filter>
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
        href="/icons/vukovar-tower.png"
        filter="url(#tower-clean)"
        preserveAspectRatio="xMidYMin meet"
      />
    </g>
  </svg>
</template>


