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
  </div>
</template>
