import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HomeView from '../views/HomeView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/compositionApi',
    name: 'compositionApi',
    component: () => import('@/views/CompositionApi.vue'),
  },
  {
    path: '/video',
    name: 'videoApi',
    component: () => import('@/views/video'),
  },
  {
    path: '/office',
    name: 'office',
    component: () => import('@/views/office'),
  },
  {
    path: '/axiosUse',
    name: 'axiosUse',
    component: () => import('@/views/AxiosUse.vue'),
  },
  {
    path: '/zujianDemo',
    name: 'zujianDemo',
    component: () => import('@/views/zujianDemo.vue'),
  },
  {
    path: '/hbTable',
    name: 'hbTable',
    component: () => import('@/views/hbTable.vue'),
  },
  {
    path: '/hbTable2',
    name: 'hbTable2',
    component: () => import('@/views/hbTable2.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
