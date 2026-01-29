import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  if (config.url?.endsWith('/apikeys') && config.method === 'post') return config
  const auth = useAuthStore()
  if (auth.apiKey) {
    config.headers.Authorization = `key=${auth.apiKey}`
  }
  return config
})

export default api
