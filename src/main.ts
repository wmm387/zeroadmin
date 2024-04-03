import { createApp } from 'vue'

import ZeroAdmin from '../packages'
import App from './App.vue'

import '@unocss/reset/tailwind-compat.css'
import 'uno.css'

const app = createApp(App)
app.use(ZeroAdmin)

app.mount('#app')
