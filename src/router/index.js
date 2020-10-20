import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter(to, from, next) {
      if ([null, ""].includes(localStorage.getItem("access_token")) && [undefined, null, ""].includes(to.query.access_token)) {
        next({ name: "Login" })
      } else {
        next()
      }
    }
  },
  {
    path: "/play",
    name: "Play",
    component: () => import(/* webpackChunkName: "about" */ '../views/Play.vue'),
    beforeEnter(to, from, next) {
      if ([null, ""].includes(localStorage.getItem("access_token"))) {
        next({ name: "Login" })
      } else {
        next()
      }
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
