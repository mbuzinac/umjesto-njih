import { ref, reactive, computed, watch } from 'vue'
import { useFetch } from 'nuxt/app'
import type { Defender } from '~/types/models'

interface DefenderFilters {
  query?: string
  jedinica?: string | null
  godina_pogibije?: number | null
  status?: string | null
}

export const useDefenders = () => {
  const defenders = ref<Defender[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = reactive<DefenderFilters>({})
  const pageSize = ref(18)
  const currentPage = ref(1)

  const fetchDefenders = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useFetch<Defender[]>('/api/defenders')
      if (fetchError.value) {
        throw fetchError.value
      }
      defenders.value = data.value || []
    } catch (err) {
      error.value = (err as Error).message || 'Greška pri dohvaćanju.'
    } finally {
      loading.value = false
    }
  }

  const filteredDefenders = computed(() => {
    return defenders.value.filter((defender: Defender) => {
      const normalizedIme = defender.ime?.toLowerCase() ?? ''
      const normalizedPrezime = defender.prezime?.toLowerCase() ?? ''

      const matchesQuery = filters.query
        ? `${normalizedIme} ${normalizedPrezime}`.includes(filters.query.toLowerCase().trim())
        : true

      const matchesJedinica = filters.jedinica
        ? defender.jedinica
          ? defender.jedinica.toLowerCase().includes(filters.jedinica.toLowerCase())
          : false
        : true

      const matchesGodina = filters.godina_pogibije
        ? defender.godina_pogibije === filters.godina_pogibije
        : true

      const matchesStatus = filters.status
        ? defender.status
          ? defender.status.toLowerCase() === filters.status.toLowerCase()
          : false
        : true

      return matchesQuery && matchesJedinica && matchesGodina && matchesStatus
    })
  })

  const totalPages = computed(() => Math.ceil(filteredDefenders.value.length / pageSize.value) || 1)

  const paginatedDefenders = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredDefenders.value.slice(start, start + pageSize.value)
  })

  watch(
    () => ({
      query: filters.query,
      jedinica: filters.jedinica,
      godina_pogibije: filters.godina_pogibije,
      status: filters.status,
      total: filteredDefenders.value.length
    }),
    () => {
      currentPage.value = 1
    }
  )

  return {
    defenders,
    loading,
    error,
    filters,
    pageSize,
    currentPage,
    totalPages,
    filteredDefenders,
    paginatedDefenders,
    fetchDefenders
  }
}

