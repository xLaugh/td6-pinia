import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    apiKey: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.apiKey
  },
  actions: {
    setApiKey(key) {
      this.apiKey = key
    },
    logout() {
      this.apiKey = null
    }
  },
  persist: true
})
