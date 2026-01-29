import axios from 'axios'
import { toast } from 'vue3-toastify'
import { API_BASE_URL } from '../config/api'
import { useAuthStore } from '../stores/auth'
import router from '../router'

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message ?? error.message ?? 'Erreur API'

    if (status === 401) {
      useAuthStore().logout()
      router.push({ name: 'Login' })
      toast.error('Session expirée ou clé invalide. Veuillez vous reconnecter')
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api
