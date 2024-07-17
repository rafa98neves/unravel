import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/WelcomeView.vue')
    },
    {
      path: '/home',
      name: 'universe',
      component: () => import('../views/CanvasView.vue')
    }
  ]
})

export default router
