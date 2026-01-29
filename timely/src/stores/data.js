import { defineStore } from 'pinia'
import api from '../plugins/axios'

export const useDataStore = defineStore('data', {
  state: () => ({
    projects: [],
    activities: [],
    dailyObjectives: [],
    loading: false
  }),
  getters: {
    // Treat items as active when `is_active` is not explicitly `false`.
    // Some API responses may omit `is_active`, so default to active.
    activeProjects: (state) => state.projects.filter(p => p.is_active !== false),
    activeActivities: (state) => state.activities.filter(a => a.is_active !== false)
  },
  actions: {
    async fetchProjects() {
      try {
        this.loading = true
        const response = await api.get('/api/projects')
        this.projects = response.data.data || response.data
      } catch (error) {
        console.error('Erreur récupération projets:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchActivities() {
      try {
        this.loading = true
        const response = await api.get('/api/activities')
        this.activities = response.data.data || response.data
      } catch (error) {
        console.error('Erreur récupération activités:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchDailyObjectives() {
      try {
        this.loading = true
        const today = new Date().toISOString().split('T')[0]
        const response = await api.get('/api/daily-objectives', {
          params: { date: today }
        })
        this.dailyObjectives = response.data.data || response.data
      } catch (error) {
        console.error('Erreur récupération objectifs:', error)
      } finally {
        this.loading = false
      }
    },

    async addProject(data) {
      try {
        this.loading = true
        const response = await api.post('/api/projects', data)
        console.debug('addProject response:', response.data)
        this.projects.push(response.data)
        return response.data
      } catch (error) {
        console.error('Erreur création projet:', error)
      } finally {
        this.loading = false
      }
    },

    async addActivity(data) {
      try {
        this.loading = true
        const response = await api.post('/api/activities', data)
        console.debug('addActivity response:', response.data)
        this.activities.push(response.data)
        return response.data
      } catch (error) {
        console.error('Erreur création activité:', error)
      } finally {
        this.loading = false
      }
    }
  },
  persist: true
})
