import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Defender } from '~/types/models'

let cache: Defender[] | null = null

export const getLocalDefenders = (): Defender[] => {
  if (cache) {
    return cache
  }

  try {
    const filePath = join(process.cwd(), 'data', 'branitelji.json')
    const payload = readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(payload)
    if (Array.isArray(parsed)) {
      cache = parsed as Defender[]
    } else if (Array.isArray(parsed.defenders)) {
      cache = parsed.defenders as Defender[]
    } else {
      console.warn('[local-defenders] JSON format not recognised, expected array or { defenders: [] }')
      cache = []
    }
  } catch (error) {
    console.warn('[local-defenders] Unable to read data/branitelji.json', error)
    cache = []
  }

  return cache
}

export const findLocalDefender = (id: string): Defender | undefined => {
  const defenders = getLocalDefenders()
  return defenders.find((defender) => defender.id === id)
}

