export interface Defender {
  id: string
  ime: string
  prezime: string
  godina_rođenja: number | null
  godina_pogibije: number | null
  mjesto_rođenja: string
  mjesto_pogibije: string
  fotka_url: string
  jedinica: string
  status?: string | null
}

export type MemoryStatus = 'pending' | 'approved' | 'rejected'

export interface Memory {
  id: string
  branitelj_id: string
  ime_autora: string
  email?: string
  poruka: string
  slika_url?: string
  slika_storage_path?: string
  dopusti_javno: boolean
  status: MemoryStatus
  created_at: string
  moderated_at?: string | null
}

export interface MemoryPayload {
  ime_autora: string
  email?: string
  poruka: string
  slika?: File | null
  dopusti_javno: boolean
  slika_storage_path?: string
}

