import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import logsRouter from './modules/log'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    meta: { roles: ['admin', 'user'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'User',
        meta: { title: 'user', icon: 'user' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    meta: { roles: ['admin', 'role'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/role/index'),
        name: 'Role',
        meta: { title: 'role', icon: 'role' }
      }
    ]
  },
  {
    path: '/auth',
    component: Layout,
    meta: { roles: ['admin', 'auth'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/auth/index'),
        name: 'Auth',
        meta: { title: 'auth', icon: 'auth' }
      }
    ]
  },
  /** When your routing table is too long, you can split it into small modules**/
  logsRouter,
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'externalLink', icon: 'link' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
