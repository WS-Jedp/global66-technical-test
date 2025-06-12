import { createApp } from 'vue'
import App from './App.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import router from './router'

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import './style.css';

const app = createApp(App)
app.use(createPinia())
app.use(VueQueryPlugin)
app.use(router)
app.mount('#app')