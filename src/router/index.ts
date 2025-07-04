import { createRouter, createWebHistory } from 'vue-router'
import TransformersView from '@/views/TransformersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'transformers',
    },
    {
      path: '/transformers',
      name: 'transformers',
      component: TransformersView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
