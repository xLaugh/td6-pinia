<template>
  <div class="activites-view">
    <!-- Time Tracker Section -->
    <section class="time-tracker">
      <h2>Time Tracker</h2>
      
      <!-- Activité en cours -->
      <div v-if="isTracking" class="current-activity">
        <div class="activity-header">
          <h3>Activité en cours</h3>
          <button @click="stopActivity" class="btn btn-stop" :disabled="loading">
            ⏹ Arrêter
          </button>
        </div>
        
        <div class="activity-details">
          <div class="activity-info">
            <p><strong>Projet:</strong> {{ currentProject?.name }}</p>
            <p><strong>Type:</strong> {{ currentActivity?.name }}</p>
            <p><strong>Début:</strong> {{ formatTime(currentEntry.start) }}</p>
          </div>
          
          <div class="timer">
            <div class="elapsed-time" :class="{ active: isTracking }">
              {{ formattedElapsedTime }}
            </div>
          </div>
        </div>

        <!-- Notes sur l'activité -->
        <div class="notes-section">
          <textarea 
            v-model="currentNotes"
            placeholder="Notes sur cette activité..."
            class="notes-input"
          ></textarea>
        </div>
      </div>

      <!-- Formulaire de démarrage -->
      <div v-else class="start-activity-form">
        <h3>Démarrer une activité</h3>
        
        <div class="form-group">
          <label for="project-select">Projet *</label>
          <select v-model="selectedProjectId" id="project-select" class="input-select">
            <option value="">-- Sélectionner un projet --</option>
            <option v-for="project in activeProjects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="activity-select">Type d'activité *</label>
          <select v-model="selectedActivityId" id="activity-select" class="input-select">
            <option value="">-- Sélectionner une activité --</option>
            <option v-for="activity in activeActivities" :key="activity.id" :value="activity.id">
              <span 
                v-if="activity.color" 
                class="activity-color"
                :style="{ backgroundColor: activity.color }"
              ></span>
              {{ activity.name }}
            </option>
          </select>
        </div>

        <button 
          @click="startActivity"
          class="btn btn-primary"
          :disabled="!selectedProjectId || !selectedActivityId || loading"
        >
          ▶ Démarrer l'activité
        </button>
      </div>

      <!-- Liste des activités du jour -->
      <div class="today-activities">
        <h3>Activités d'aujourd'hui</h3>
        
        <div class="filters">
          <input 
            v-model="filterProject"
            type="text"
            placeholder="Filtrer par projet..."
            class="filter-input"
          />
          <input 
            v-model="filterActivity"
            type="text"
            placeholder="Filtrer par type d'activité..."
            class="filter-input"
          />
          <input 
            v-model="filterKeywords"
            type="text"
            placeholder="Chercher par mots-clés..."
            class="filter-input"
          />
        </div>

        <div v-if="filteredEntries.length > 0" class="entries-list">
          <TimeEntryCard 
            v-for="entry in filteredEntries"
            :key="entry.id"
            :entry="entry"
            @edit="editEntry"
            @delete="deleteEntry"
          />
        </div>
        <p v-else class="no-entries">Aucune activité aujourd'hui</p>
      </div>
    </section>

    <!-- Objectifs journaliers (à venir) -->
    <section class="daily-objectives">
      <h2>Objectifs journaliers</h2>
      <p class="coming-soon">Section à développer...</p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTimeEntryStore } from '../stores/timeEntry'
import { useDataStore } from '../stores/data'
import TimeEntryCard from '../components/TimeEntryCard.vue'

const timeEntryStore = useTimeEntryStore()
const dataStore = useDataStore()

// États
const selectedProjectId = ref('')
const selectedActivityId = ref('')
const currentNotes = ref('')
const filterProject = ref('')
const filterActivity = ref('')
const filterKeywords = ref('')
const loading = ref(false)
let timerInterval = null

// Propriétés calculées
const isTracking = computed(() => timeEntryStore.isTracking)
const currentEntry = computed(() => timeEntryStore.currentEntry)
const entries = computed(() => timeEntryStore.todayEntries)
const activeProjects = computed(() => dataStore.activeProjects)
const activeActivities = computed(() => dataStore.activeActivities)

const currentProject = computed(() => {
  return activeProjects.value.find(p => p.id === currentEntry.value?.project_id)
})

const currentActivity = computed(() => {
  return activeActivities.value.find(a => a.id === currentEntry.value?.activity_id)
})

const formattedElapsedTime = computed(() => {
  const duration = timeEntryStore.currentEntryDuration
  return timeEntryStore.formattedDuration(duration)
})

const filteredEntries = computed(() => {
  return entries.value.filter(entry => {
    const projectName = getProjectName(entry.project_id).toLowerCase()
    const activityName = getActivityName(entry.activity_id).toLowerCase()
    const comment = (entry.comment || '').toLowerCase()

    const matchProject = !filterProject.value || projectName.includes(filterProject.value.toLowerCase())
    const matchActivity = !filterActivity.value || activityName.includes(filterActivity.value.toLowerCase())
    const matchKeywords = !filterKeywords.value || comment.includes(filterKeywords.value.toLowerCase())

    return matchProject && matchActivity && matchKeywords
  })
})

// Méthodes
const startActivity = async () => {
  if (!selectedProjectId.value || !selectedActivityId.value) return
  
  loading.value = true
  await timeEntryStore.startActivity(selectedProjectId.value, selectedActivityId.value)
  loading.value = false
  
  selectedProjectId.value = ''
  selectedActivityId.value = ''
  currentNotes.value = ''
}

const stopActivity = async () => {
  loading.value = true
  await timeEntryStore.stopActivity()
  loading.value = false
}

const deleteEntry = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
    loading.value = true
    await timeEntryStore.deleteEntry(id)
    loading.value = false
  }
}

const editEntry = (entry) => {
  // À implémenter: modal/form de modification
  console.log('Éditer entrée:', entry)
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const getProjectName = (projectId) => {
  return activeProjects.value.find(p => p.id === projectId)?.name || 'Inconnu'
}

const getActivityName = (activityId) => {
  return activeActivities.value.find(a => a.id === activityId)?.name || 'Inconnu'
}

// Lifecycle
onMounted(async () => {
  await dataStore.fetchProjects()
  await dataStore.fetchActivities()
  await timeEntryStore.fetchEntries()

  // Démarrer le timer pour l'affichage du temps écoulé
  timerInterval = setInterval(() => {
    if (isTracking.value) {
      // Force la réactivité
      timeEntryStore.updateElapsedTime()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.activites-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

section {
  margin-bottom: 3rem;
}

h2 {
  color: #333;
  border-bottom: 3px solid #007bff;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

h3 {
  color: #555;
  margin-bottom: 1rem;
}

/* Current Activity */
.current-activity {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.activity-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
  align-items: center;
}

.activity-info p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.timer {
  text-align: center;
}

.elapsed-time {
  font-size: 3rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Start Activity Form */
.start-activity-form {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  border: 2px dashed #ddd;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.input-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.input-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.activity-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 0.5rem;
  vertical-align: middle;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.btn-primary {
  background-color: #28a745;
  color: white;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-stop {
  background-color: #dc3545;
  color: white;
  padding: 0.75rem 1.5rem;
}

.btn-stop:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.3);
}

.btn-stop:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-small {
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
}

.btn-edit {
  background-color: #17a2b8;
  color: white;
  margin-right: 0.5rem;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

/* Notes */
.notes-section {
  margin-top: 1rem;
}

.notes-input {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-family: 'Courier New', monospace;
  resize: vertical;
}

/* Entries List */
.today-activities {
  margin-top: 2rem;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.filter-input:focus {
  outline: none;
  border-color: #007bff;
}

.entries-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.no-entries {
  text-align: center;
  color: #999;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

/* Daily Objectives */
.daily-objectives {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
}

.coming-soon {
  color: #999;
  font-style: italic;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .activity-details {
    grid-template-columns: 1fr;
  }

  .activity-header {
    flex-direction: column;
    gap: 1rem;
  }

  .btn-stop {
    width: 100%;
  }

  .elapsed-time {
    font-size: 2rem;
  }

  .entries-list {
    grid-template-columns: 1fr;
  }

  .filters {
    grid-template-columns: 1fr;
  }
}
</style>
