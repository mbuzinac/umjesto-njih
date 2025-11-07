<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useSupabaseClient } from '~/composables/useSupabaseClient'

const props = defineProps<{ defenderId: string }>()

const form = reactive({
  ime_autora: '',
  email: '',
  poruka: '',
  dopusti_javno: true
})

const selectedFile = ref<File | null>(null)
const submitting = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

const supabase = useSupabaseClient()
const runtimeConfig = useRuntimeConfig()
const bucketName = runtimeConfig.public.supabaseBucket || 'memories'

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
  }
}

const uploadImageIfNeeded = async () => {
  if (!selectedFile.value) {
    return { url: '', path: '' }
  }

  if (!bucketName) {
    throw new Error('Nije konfiguriran Supabase storage bucket.')
  }

  const file = selectedFile.value
  const fileId = crypto.randomUUID()
  const path = `${props.defenderId}/${fileId}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(path, file, { contentType: file.type })

  if (uploadError) {
    throw new Error(uploadError.message || 'Greška pri uploadu slike.')
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

const submit = async () => {
  if (!form.ime_autora || !form.poruka) {
    error.value = 'Ime autora i poruka su obavezni.'
    return
  }

  submitting.value = true
  error.value = null
  success.value = false

  try {
    const { url: slikaUrl, path: slikaPath } = await uploadImageIfNeeded()

    await $fetch(`/api/defenders/${props.defenderId}/memories`, {
      method: 'POST',
      body: {
        ...form,
        slika_url: slikaUrl,
        slika_storage_path: slikaPath,
        dopusti_javno: form.dopusti_javno
      }
    })

    success.value = true
    selectedFile.value = null
    form.ime_autora = ''
    form.email = ''
    form.poruka = ''
    form.dopusti_javno = true
  } catch (err) {
    console.error(err)
    error.value = (err as Error).message || 'Greška pri slanju sjećanja.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="space-y-6" @submit.prevent="submit">
    <div class="grid gap-4 sm:grid-cols-2">
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Ime i prezime</label>
        <input v-model="form.ime_autora" type="text" required class="rounded-xl border-slate-200 text-sm" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Email (opcionalno)</label>
        <input v-model="form.email" type="email" placeholder="email@primjer.hr" class="rounded-xl border-slate-200 text-sm" />
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Poruka</label>
      <textarea v-model="form.poruka" required rows="5" class="rounded-xl border-slate-200 text-sm"></textarea>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-xs font-semibold uppercase tracking-wide text-slate-500">Fotografija (opcionalno)</label>
      <input type="file" accept="image/*" class="rounded-xl border-slate-200 text-sm" @change="handleFileChange" />
    </div>

    <label class="flex items-start gap-3 text-sm text-slate-600">
      <input v-model="form.dopusti_javno" type="checkbox" class="mt-0.5 rounded border-slate-300 text-primary focus:ring-primary" />
      <span>Dopuštam javno prikazivanje sjećanja nakon odobrenja administratora.</span>
    </label>

    <div class="flex flex-col gap-2">
      <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="submitting">
        {{ submitting ? 'Slanje…' : 'Pošalji sjećanje' }}
      </button>
      <p v-if="success" class="text-sm text-emerald-600">Hvala! Sjećanje je zaprimljeno i čeka odobrenje.</p>
      <p v-if="error" class="text-sm text-rose-600">{{ error }}</p>
    </div>
  </form>
</template>

