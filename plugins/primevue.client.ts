import { defineNuxtPlugin } from 'nuxt/app'
import PrimeVue from 'primevue/config'
import Paginator from 'primevue/paginator'
import Tooltip from 'primevue/tooltip'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    inputStyle: 'outlined'
  })

  nuxtApp.vueApp.component('Paginator', Paginator)
  nuxtApp.vueApp.directive('tooltip', Tooltip)
})

