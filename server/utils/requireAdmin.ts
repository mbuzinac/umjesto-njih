import { createError, getHeader } from 'h3'
import { useRuntimeConfig } from '#imports'
import { useSupabaseAdmin } from './supabaseAdmin'

export const requireAdmin = async (event: Parameters<typeof getHeader>[0]) => {
  const supabase = useSupabaseAdmin()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin nije konfiguriran.' })
  }

  const header = getHeader(event, 'authorization')

  if (!header || !header.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Nedostaje admin token.' })
  }

  const token = header.slice(7)

  try {
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      throw error || new Error('Neuspjela validacija korisnika.')
    }

    const config = useRuntimeConfig()
    const allowedEmail = config.public.adminEmail

    if (allowedEmail && data.user.email !== allowedEmail) {
      throw createError({ statusCode: 403, statusMessage: 'Neautorizirani admin korisnik.' })
    }

    return data.user
  } catch (error) {
    console.error('[admin] Token verification failed', error)
    throw createError({ statusCode: 401, statusMessage: 'Neispravan admin token.' })
  }
}

