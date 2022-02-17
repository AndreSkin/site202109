import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1beeb11e = () => interopDefault(import('..\\pages\\Home\\index.vue' /* webpackChunkName: "pages/Home/index" */))
const _aed7fb2c = () => interopDefault(import('..\\pages\\Item\\index.vue' /* webpackChunkName: "pages/Item/index" */))
const _3a1a726f = () => interopDefault(import('..\\pages\\Pay\\index.vue' /* webpackChunkName: "pages/Pay/index" */))
const _0e85035a = () => interopDefault(import('..\\pages\\Register\\index.vue' /* webpackChunkName: "pages/Register/index" */))
const _23776eb2 = () => interopDefault(import('..\\pages\\User\\index.vue' /* webpackChunkName: "pages/User/index" */))
const _07a0253d = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/Home",
    component: _1beeb11e,
    name: "Home"
  }, {
    path: "/Item",
    component: _aed7fb2c,
    name: "Item"
  }, {
    path: "/Pay",
    component: _3a1a726f,
    name: "Pay"
  }, {
    path: "/Register",
    component: _0e85035a,
    name: "Register"
  }, {
    path: "/User",
    component: _23776eb2,
    name: "User"
  }, {
    path: "/",
    component: _07a0253d,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
