<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div>
    <header>
      <router-link to="/">Timely</router-link>
      <div>
        <router-link to="/profil">Paramètres</router-link>
        <button type="button" @click="logout">Déconnexion</button>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ddd;
}

header > div {
  display: flex;
  gap: 10px;
  align-items: center;
}

main {
  padding: 1rem;
}
</style>
