import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store/index'

Vue.use(VueRouter)

async function beforeEnter (_to, _from, next) {
  if (!store.getters['user/isAuthenticated']) {
    await store.dispatch('user/fetchUser')
  }
  if (store.getters['user/isAuthenticated']) {
    next()
    return
  }
  next('/login')
}

// the function continues in the second panel, not enough space here
const routes = [
  {
    path: '/',
    redirect: '/modules'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import(/* webpackChunkName: "test" */ '../views/test.vue'),
    beforeEnter
  },
  {
    path: '/module/:moduleId/session/:sessionId/exercise/:exerciseId',
    name: 'Exercise',
    component: () => import(/* webpackChunkName: "exercise" */ '../views/Exercise.vue'),
    beforeEnter
  },
  {
    path: '/module/:moduleId',
    name: 'Module',
    component: () => import(/* webpackChunkName: "exercise" */ '../views/Module.vue'),
    beforeEnter
  },
  {
    path: '/modules',
    name: 'Modules',
    component: () => import(/* webpackChunkName: "exercise" */ '../views/Modules.vue'),
    beforeEnter
  }
]

export default new VueRouter({
  routes
})
