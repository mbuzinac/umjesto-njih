# Umjesto njih – digitalna memorijalna platforma

Nuxt 3 aplikacija s Tailwind CSS-om, Firebase-om (Firestore, Storage, Auth) i SSR podrškom. Omogućuje javni pregled branitelja, dodavanje sjećanja te administratorski CRUD nad braniteljima i moderiranje sjećanja.

## Stack

- Nuxt 3 (SSR-ready)
- Tailwind CSS + @tailwindcss/forms
- Supabase (Postgres, Auth, Storage, service role API)
- Typescript + composables za pristup podacima

## Brzi start

```bash
npm install
npm run dev
```

Aplikacija je dostupna na `http://localhost:3000`.

## Konfiguracija okruženja

Kopiraj `.env.example` u `.env` i popuni vrijednosti:

```bash
cp .env.example .env
```

| Varijabla | Opis |
|-----------|------|
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase projekt URL |
| `NUXT_PUBLIC_SUPABASE_ANON_KEY` | Public (anon) API ključ |
| `NUXT_PUBLIC_SUPABASE_BUCKET` | Naziv storage bucket-a (npr. `memories`) |
| `NUXT_PUBLIC_ADMIN_EMAIL` | Email admin korisnika koji smije pristupiti /admin |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role ključ (samo server-side) |
| `SUPABASE_STORAGE_BUCKET` | (opcionalno) ako se server-side bucket razlikuje |

> `SUPABASE_SERVICE_ROLE_KEY` drži u tajnosti – koristi se samo na serveru i daje puni pristup bazi i storageu.

## Supabase pravila

1. **Baza (Postgres)**
   - Tablica `branitelji` dostupna je za čitanje svima (anon key), pisanje samo preko server API-ja (service role) ili strogo definiranih RLS pravila za admina.
   - Tablica `sjecanja`: javno čitanje dopušteno samo za retke gdje je `status = 'approved'` i `dopusti_javno = true`. Upis omogućiti anonimnim korisnicima, a izmjene/brisanja ograničiti na admin korisnike.

2. **Storage**
   - Bucket `memories` (ili drugi odabrani naziv) dopušta upload autentificiranim klijentima. Preporuka je ograničiti veličinu/tip datoteka policyjem i dopustiti brisanje samo adminu.

## Struktura aplikacije

- `pages/index.vue` – početna s kratkim opisom i ukupnim brojem branitelja
- `pages/branitelji` – popis s filtrima (ime, prezime, jedinica, godina pogibije)
- `pages/branitelji/[id]` – detaljni profil branitelja i lista odobrenih sjećanja
- `pages/branitelji/[id]/dodaj-sjecanje` – forma za predaju sjećanja (status `pending`)
- `pages/admin/index` – admin login (Supabase Auth email/password)
- `pages/admin/branitelji` – CRUD nad kolekcijom `branitelji`
- `pages/admin/sjecanja` – moderiranje (`pending → approved/rejected`) i brisanje sjećanja

Server API (`/server/api/**`) koristi Supabase service-role klijent i provjerava Bearer token prijavljenog admina. Email se dodatno provjerava prema `NUXT_PUBLIC_ADMIN_EMAIL`.

## Razvojni workflow

- `npm run dev` – lokalni razvoj s hot-reloadom
- `npm run build` – produkcijski build
- `npm run preview` – provjera builda

Preporuka: koristiti Vercel ili Netlify za hosting, uz postavljanje environment varijabli.

## Daljnji koraci

- Postaviti Supabase RLS pravila prema preporukama iznad
- Implementirati audit logove (Supabase trigger ili Edge Function)
- Dodati paginaciju i naprednu pretragu
- Dodati i18n podršku ako je potrebna
