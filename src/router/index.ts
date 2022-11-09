import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import BBSRegisterView from '../views/bbs/BBSRegisterView.vue'
import BBSListView from '../views/bbs/BBSListView.vue'
import BBSDetailView from '../views/bbs/BBSDetailView.vue'
import BBSModifyView from '../views/bbs/BBSModifyView.vue'
import MemberRegisterView from '../views/member/MemberRegisterView.vue'
import MemberListView from '../views/member/MemberListView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: BBSListView
  },
  {
    path: '/bbs/register',
    name: 'bbs-register',
    component: BBSRegisterView
  },
  {
    path: '/bbs/list',
    name: 'bbs-list',
    component: BBSListView
  },
  {
    path: '/bbs/view/:id',
    name: 'bbs-view',
    component: BBSDetailView,
    props: true
  },
  {
    path: '/bbs/modify/:id',
    name: 'bbs-modify',
    component: BBSModifyView,
    props: true
  },
  {
    path: '/member/register',
    name: 'member-register',
    component: MemberRegisterView
  },
  {
    path: '/member/list',
    name: 'member-list',
    component: MemberListView
  },
  {
    path: '/:catchAll(.*)',
    name: 'not-found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
