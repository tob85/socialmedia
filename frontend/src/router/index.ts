import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import RegisterPage from '@/pages/RegisterPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import MyCirclesPage from '@/pages/MyCirclesPage.vue'
import FindCirclesPage from '@/pages/FindCirclesPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/register', name: 'register', component: RegisterPage },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/circles', name: 'circles', component: MyCirclesPage },
    { path: '/circles/find', name: 'find-circles', component: FindCirclesPage },
  ],
})

export default router
