import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../pages/WelcomePage.vue'),
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../pages/FavoritesPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
