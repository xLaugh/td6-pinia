import { defineStore } from 'pinia'
import api from '../plugins/axios'
import { toast } from 'vue3-toastify'

export const useTimeEntryStore = defineStore('timeEntry', {
  state: () => ({
    currentEntry: null,
    entries: [],
    loading: false,
    elapsedTime: 0
  }),
  getters: {
    isTracking: (state) => state.currentEntry !== null,
    currentEntryDuration: (state) => {
      if (!state.currentEntry) return 0
      return Math.floor((Date.now() - new Date(state.currentEntry.start).getTime()) / 1000)
    },
    formattedDuration: (state) => (seconds) => {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      const secs = seconds % 60
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    },
    todayEntries: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.entries.filter(entry => {
        const entryDate = entry.start.split(' ')[0]
        return entryDate === today
      })
    }
  },
  actions: {
    async startActivity(projectId, activityId) {
      try {
        this.loading = true
        const response = await api.post('/api/time-entries', {
          project_id: projectId,
          activity_id: activityId
        })
        this.currentEntry = response.data
        await this.fetchEntries()
        toast.success('Activité démarrée')
      } catch (error) {
        console.error('Erreur démarrage activité:', error)
      } finally {
        this.loading = false
      }
    },

    async stopActivity() {
      if (!this.currentEntry?.id) return
      
      try {
        this.loading = true
        await api.patch(`/api/time-entries/${this.currentEntry.id}/stop`)
        this.currentEntry = null
        await this.fetchEntries()
        toast.success('Activité arrêtée')
      } catch (error) {
        console.error('Erreur arrêt activité:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchEntries(filters = {}) {
      try {
        this.loading = true
        const params = new URLSearchParams()
        
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            params.append(key, filters[key])
          }
        })

        const response = await api.get('/api/time-entries', { params })
        this.entries = response.data.data || response.data
        
        // Récupérer l'entrée en cours (celle sans end)
        this.currentEntry = this.entries.find(entry => !entry.end) || null
      } catch (error) {
        console.error('Erreur récupération entrées:', error)
      } finally {
        this.loading = false
      }
    },

    async updateEntry(id, data) {
      try {
        this.loading = true
        const response = await api.put(`/api/time-entries/${id}`, data)
        const index = this.entries.findIndex(e => e.id === id)
        if (index !== -1) {
          this.entries[index] = response.data
        }
        toast.success('Entrée modifiée')
      } catch (error) {
        console.error('Erreur modification entrée:', error)
      } finally {
        this.loading = false
      }
    },

    async deleteEntry(id) {
      try {
        this.loading = true
        await api.delete(`/api/time-entries/${id}`)
        this.entries = this.entries.filter(e => e.id !== id)
        toast.success('Entrée supprimée')
      } catch (error) {
        console.error('Erreur suppression entrée:', error)
      } finally {
        this.loading = false
      }
    },

    async createEntry(data) {
      try {
        this.loading = true
        const response = await api.post('/api/time-entries', data)
        this.entries.push(response.data)
        toast.success('Entrée créée')
        return response.data
      } catch (error) {
        console.error('Erreur création entrée:', error)
      } finally {
        this.loading = false
      }
    },

    updateElapsedTime() {
      if (this.currentEntry) {
        this.elapsedTime += 1
      }
    }
  },
  persist: {
    key: 'timeEntry',
    paths: ['currentEntry']
  }
})
