import { ref, reactive, computed } from 'vue'
import { useFetch } from 'nuxt/app'
import type { Defender } from '~/types/models'

interface DefenderFilters {
  ime?: string
  prezime?: string
  jedinica?: string
  godina_pogibije?: number | null
}

export const useDefenders = () => {
  const defenders = ref<Defender[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = reactive<DefenderFilters>({})

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
      const matchesIme = filters.ime
        ? defender.ime.toLowerCase().includes(filters.ime.toLowerCase())
        : true
      const matchesPrezime = filters.prezime
        ? defender.prezime.toLowerCase().includes(filters.prezime.toLowerCase())
        : true
      const matchesJedinica = filters.jedinica
        ? defender.jedinica.toLowerCase().includes(filters.jedinica.toLowerCase())
        : true
      const matchesGodina = filters.godina_pogibije
        ? defender.godina_pogibije === filters.godina_pogibije
        : true

      return matchesIme && matchesPrezime && matchesJedinica && matchesGodina
    })
  })

  return {
    defenders,
    loading,
    error,
    filters,
    filteredDefenders,
    fetchDefenders
  }
}

