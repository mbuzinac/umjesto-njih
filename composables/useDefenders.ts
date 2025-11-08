import { ref, reactive, computed, watch, onScopeDispose, type Ref, type ComputedRef } from 'vue'
import { useRequestFetch } from '#app'
import type { Defender } from '~/types/models'

interface DefenderFilters {
  query?: string
  jedinica?: string | null
  godina_pogibije?: number | null
  status?: string | null
}

interface UseDefendersResult {
  defenders: Ref<Defender[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  filters: DefenderFilters
  pageSize: Ref<number>
  currentPage: Ref<number>
  total: Ref<number>
  totalPages: ComputedRef<number>
  from: ComputedRef<number>
  to: ComputedRef<number>
  hasActiveFilters: ComputedRef<boolean>
  availableYears: Ref<number[]>
  fetchDefenders: () => Promise<void>
}

export const useDefenders = (): UseDefendersResult => {
  const defenders = ref<Defender[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = reactive<DefenderFilters>({
    query: ''
  })
  const pageSize = ref(18)
  const currentPage = ref(1)
  const total = ref(0)
  const availableYears = ref<number[]>([])
  const requestFetch = useRequestFetch()

  const fetchDefenders = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await requestFetch<{
        items: Defender[]
        total: number
        page: number
        pageSize: number
      }>('/api/defenders', {
        params: {
          page: currentPage.value,
          pageSize: pageSize.value,
          q: filters.query || undefined,
          status: filters.status || undefined,
          jedinica: filters.jedinica || undefined,
          godina: filters.godina_pogibije ?? undefined
        }
      })

      defenders.value = response.items || []
      total.value = response.total || 0
      if (response.pageSize && response.pageSize !== pageSize.value) {
        pageSize.value = response.pageSize
      }

      const yearsSet = new Set<number>(availableYears.value)
      defenders.value.forEach((defender) => {
        if (defender.godina_pogibije) {
          yearsSet.add(defender.godina_pogibije)
        }
      })
      availableYears.value = Array.from(yearsSet).sort((a, b) => a - b)
    } catch (err) {
      error.value = (err as Error).message || 'Greška pri dohvaćanju.'
    } finally {
      loading.value = false
    }
  }

  const totalPages = computed(() => (total.value ? Math.ceil(total.value / pageSize.value) : 1))

  const from = computed(() => {
    if (!total.value) {
      return 0
    }
    return (currentPage.value - 1) * pageSize.value + 1
  })

  const to = computed(() => {
    if (!total.value) {
      return 0
    }
    return Math.min(currentPage.value * pageSize.value, total.value)
  })

  const hasActiveFilters = computed(() => {
    return Boolean(
      filters.query ||
        filters.status ||
        filters.jedinica ||
        (filters.godina_pogibije !== null && filters.godina_pogibije !== undefined)
    )
  })

  let queryDebounce: ReturnType<typeof setTimeout> | null = null

  watch(
    () => filters.query,
    () => {
      if (queryDebounce) {
        clearTimeout(queryDebounce)
      }
      queryDebounce = setTimeout(() => {
        if (currentPage.value !== 1) {
          currentPage.value = 1
        } else {
          fetchDefenders()
        }
      }, 250)
    }
  )

  watch(
    () => ({
      status: filters.status,
      jedinica: filters.jedinica,
      godina_pogibije: filters.godina_pogibije
    }),
    () => {
      if (currentPage.value !== 1) {
        currentPage.value = 1
      } else {
        fetchDefenders()
      }
    },
    { deep: true }
  )

  watch([currentPage, pageSize], () => {
    fetchDefenders()
  })

  onScopeDispose(() => {
    if (queryDebounce) {
      clearTimeout(queryDebounce)
    }
  })

  return {
    defenders,
    loading,
    error,
    filters,
    pageSize,
    currentPage,
    total,
    totalPages,
    from,
    to,
    hasActiveFilters,
    availableYears,
    fetchDefenders
  }
}

