import { createRouter, createWebHistory } from 'vue-router'
import { useSearchStore } from '../store/useSearchStore'

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
  history: createWebHistory('/global66-technical-test/'),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Navigation guard to clear search when switching between Home and Favorites
router.beforeEach((to, from) => {
  // Clear search when navigating between Home and Favorites pages
  if (
    (from.name === 'Home' && to.name === 'Favorites') ||
    (from.name === 'Favorites' && to.name === 'Home')
  ) {
    const searchStore = useSearchStore()
    searchStore.clearSearch()
  }
})

export default router
