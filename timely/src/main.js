import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import App from './App.vue'
import router from './router'
import './style.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Vue3Toastify, { autoClose: 3000 })
app.mount('#app')
