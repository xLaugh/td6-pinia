<template>
  <div>
    <h2>Profil</h2>
    
    <form @submit.prevent="saveProfile" class="profile-form">
      <div class="form-field">
        <label>Nom:</label><br>
        <input v-model="name" type="text" required />
      </div>
      
      <div class="form-field">
        <label>Email:</label><br>
        <input v-model="email" type="email" required />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import api from '../plugins/axios'
import { ref, onMounted } from 'vue'

const name = ref('')
const email = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    const { data } = await api.get('/api/profile')
    name.value = data.name || ''
    email.value = data.email || ''
  } catch (e) {
    console.error('Erreur lors du chargement du profil:', e)
  }
})

const saveProfile = async () => {
  loading.value = true
  try {
    await api.put('/api/profile', {
      name: name.value,
      email: email.value
    })
    alert('Profil mis à jour avec succès')
  } catch (e) {
    console.error('Erreur lors de la sauvegarde:', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-form {
  margin-top: 20px;
}

.form-field {
  margin-bottom: 10px;
}

.form-field input {
  width: 300px;
  padding: 5px;
}
</style>
