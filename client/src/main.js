import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { auth } from './store/auth'
import Landing from './pages/Landing.vue'
import Posts from './pages/Posts.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import PostDetail from './pages/PostDetail.vue'
import PostForm from './pages/PostForm.vue'
import NotFound from './pages/NotFound.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Landing },
    { path: '/posts', component: Posts },
    { path: '/register', component: Register, meta: { guest: true } },
    { path: '/login', component: Login, meta: { guest: true } },
    { path: '/posts/new', component: PostForm, meta: { auth: true } },
    { path: '/posts/:id', component: PostDetail },
    { path: '/posts/:id/edit', component: PostForm, meta: { auth: true } },
    { path: '/:pathMatch(.*)*', component: NotFound },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(to => {
  if (to.meta.auth && !auth.token) return { path: '/login', query: { redirect: to.fullPath } }
  if (to.meta.guest && auth.token) return '/posts'
})

createApp(App).use(router).mount('#app')
