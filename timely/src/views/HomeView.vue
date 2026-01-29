<script setup>
import api from '../plugins/axios'
import { ref, onMounted } from 'vue'

const ping = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/api/ping')
    ping.value = JSON.stringify(data)
  } catch (e) {
    ping.value = 'Erreur: ' + (e.response?.data?.message || e.message)
  }
})
</script>

<template>
  <div>
    <h2>Activité</h2>
    <p><small>API ping:</small> {{ ping || '…' }}</p>
    
    <div class="buttons-container">
      <router-link to="/profil">
        <button>Profil</button>
      </router-link>
      <router-link to="/projets">
        <button>Projets</button>
      </router-link>
      <router-link to="/activites">
        <button>Activités</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.buttons-container {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
</style>
