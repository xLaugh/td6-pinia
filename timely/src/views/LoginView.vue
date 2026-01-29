<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../plugins/axios'

const router = useRouter()
const auth = useAuthStore()

const mode = ref('key')
const apiKey = ref('')
const name = ref('')
const email = ref('')
const loading = ref(false)
const error = ref('')

async function submitKey() {
  error.value = ''
  if (!apiKey.value.trim()) return
  loading.value = true
  try {
    auth.setApiKey(apiKey.value.trim())
    await api.get('/api/ping')
    router.push({ name: 'Home' })
  } catch (e) {
    error.value = e.response?.data?.message || 'Clé invalide ou API inaccessible'
    auth.logout()
  } finally {
    loading.value = false
  }
}

async function createAccount() {
  error.value = ''
  if (!name.value.trim() || !email.value.trim()) {
    error.value = 'Nom et email requis'
    return
  }
  loading.value = true
  try {
    const { data } = await api.post('/api/apikeys', { name: name.value.trim(), email: email.value.trim() })
    auth.setApiKey(data.api_key ?? data.key ?? data.apiKey)
    router.push({ name: 'Home' })
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur création de compte'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login">
    <h1>Timely</h1>
    <p v-if="error" class="error">{{ error }}</p>

    <template v-if="mode === 'key'">
      <input v-model="apiKey" type="text" placeholder="API Key" />
      <button :disabled="loading" @click="submitKey">Se connecter</button>
    </template>
    <template v-else>
      <input v-model="name" type="text" placeholder="Nom complet" />
      <input v-model="email" type="email" placeholder="Email" />
      <button :disabled="loading" @click="createAccount">Créer un compte</button>
    </template>

    <button type="button" class="link" @click="mode = mode === 'key' ? 'create' : 'key'">
      {{ mode === 'key' ? 'Créer un compte' : 'J\'ai déjà une API Key' }}
    </button>
  </div>
</template>

<style scoped>
.login { max-width: 320px; margin: 2rem auto; }
.login input { display: block; width: 100%; margin-bottom: 0.5rem; padding: 0.5rem; }
.login button { margin-right: 0.5rem; margin-top: 0.5rem; }
.link { background: none; border: none; text-decoration: underline; cursor: pointer; }
.error { color: #c00; margin-bottom: 0.5rem; }
</style>
