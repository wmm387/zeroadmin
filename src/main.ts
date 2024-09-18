import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

import ZeroAdmin from '../packages'
import App from './App.vue'

import '@unocss/reset/tailwind-compat.css'
import 'uno.css'

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.use(ZeroAdmin)

app.mount('#app')
