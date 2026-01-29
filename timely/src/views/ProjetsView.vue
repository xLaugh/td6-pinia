<template>
  <div>
    <h2>Projets</h2>
    
    <form @submit.prevent="createProject" class="project-form">
      <div class="form-field">
        <label>Nom:</label><br>
        <input v-model="name" type="text" required />
      </div>
      
      <div class="form-field">
        <label>Description:</label><br>
        <input v-model="description" type="text" />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Création...' : 'Créer' }}
      </button>
    </form>

    <div class="projects-list">
      <h3>Liste des projets</h3>
      <div v-if="projects.length === 0">
        Pas de projets
      </div>
      <ul v-else>
        <li v-for="project in projects" :key="project.id">
          {{ project.name }} - {{ project.description || 'Sans description' }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import api from '../plugins/axios'
import { ref, onMounted } from 'vue'

const name = ref('')
const description = ref('')
const loading = ref(false)
const projects = ref([])

const loadProjects = async () => {
  try {
    const { data } = await api.get('/api/projects')
    projects.value = data || []
  } catch (e) {
    console.error('Erreur lors du chargement des projets:', e)
    projects.value = []
  }
}

onMounted(() => {
  loadProjects()
})

const createProject = async () => {
  loading.value = true
  try {
    await api.post('/api/projects', {
      name: name.value,
      description: description.value || undefined
    })
    alert('Projet créé avec succès')
    name.value = ''
    description.value = ''
    loadProjects()
  } catch (e) {
    console.error('Erreur lors de la création du projet:', e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.project-form {
  margin-top: 20px;
}

.form-field {
  margin-bottom: 10px;
}

.form-field input {
  width: 300px;
  padding: 5px;
}

.projects-list {
  margin-top: 30px;
  background-color: smokewhite;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.projects-list ul {
  list-style: none;
  padding: 0;
}

.projects-list li {
  padding: 5px 0;
}
</style>
