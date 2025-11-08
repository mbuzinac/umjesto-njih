import { defineEventHandler, getQuery, createError } from 'h3'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin'

const DEFAULT_PAGE_SIZE = 18
const MAX_PAGE_SIZE = 100

export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin nije konfiguriran.' })
  }

  const query = getQuery(event)
  const page = Math.max(parseInt(String(query.page ?? '1'), 10) || 1, 1)
  const pageSizeRaw = parseInt(String(query.pageSize ?? DEFAULT_PAGE_SIZE), 10)
  const pageSize = Math.min(Math.max(pageSizeRaw || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE)
  const rawSearch = typeof query.q === 'string' ? query.q.trim() : ''
  const sanitizeLike = (value: string) =>
    value
      .replace(/[%_]/g, (match) => `\\${match}`)
      .replace(/,/g, ' ')
  const search = rawSearch ? sanitizeLike(rawSearch) : ''
  const status = typeof query.status === 'string' && query.status ? query.status : null
  const jedinica = typeof query.jedinica === 'string' && query.jedinica ? sanitizeLike(query.jedinica) : null
  const godina = query.godina ? Number(query.godina) : null

  let builder = supabase
    .from('branitelji')
    .select(
      `
        id,
        ime,
        prezime,
        godina_rođenja,
        godina_pogibije,
        mjesto_rođenja,
        mjesto_pogibije,
        fotka_url,
        jedinica,
        status
      `,
      { count: 'exact' }
    )
    .order('prezime', { ascending: true })
    .order('ime', { ascending: true })

  if (search) {
    builder = builder.or(`ime.ilike.%${search}%,prezime.ilike.%${search}%`)
  }

  if (status) {
    builder = builder.eq('status', status)
  }

  if (jedinica) {
    builder = builder.ilike('jedinica', `%${jedinica}%`)
  }

  if (Number.isInteger(godina)) {
    builder = builder.eq('godina_pogibije', godina as number)
  }

  const { data, count, error } = await builder.range((page - 1) * pageSize, page * pageSize - 1)

  if (error) {
    console.error('[defenders.index] Greška pri dohvaćanju branitelja', error)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri dohvaćanju branitelja.' })
  }

  return {
    items: data ?? [],
    total: count ?? data?.length ?? 0,
    page,
    pageSize
  }
})

