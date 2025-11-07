import { ref } from 'vue'
import { useFetch } from 'nuxt/app'
import type { Memory } from '~/types/models'

export const useMemories = (defenderId: string, status: string = 'approved') => {
  const memories = ref<Memory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMemories = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await useFetch<Memory[]>(`/api/defenders/${defenderId}/memories`, {
        query: { status }
      })
      if (fetchError.value) {
        throw fetchError.value
      }
      memories.value = data.value || []
    } catch (err) {
      error.value = (err as Error).message || 'Greška pri dohvaćanju sjećanja.'
    } finally {
      loading.value = false
    }
  }

  return {
    memories,
    loading,
    error,
    fetchMemories
  }
}

