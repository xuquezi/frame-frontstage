/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const logsRouter = {
  path: '/logs',
  component: Layout,
  redirect: 'noredirect',
  name: 'Logs',
  meta: {
    title: 'logs',
    icon: 'logs',
    roles: ['admin', 'role', 'user', 'auth']
  },
  children: [
    {
      path: 'login',
      component: () => import('@/views/logs/login'),
      name: 'Login',
      meta: { title: 'login', noCache: true }
    },
    {
      path: 'logout',
      component: () => import('@/views/logs/logout'),
      name: 'Logout',
      meta: { title: 'logout', noCache: true }
    },
    {
      path: 'operate',
      component: () => import('@/views/logs/operate'),
      name: 'Operate',
      meta: { title: 'operate', noCache: true }
    }
  ]
}

export default logsRouter
