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
    path: '/sub_app_page1',
    name: 'sub_app_page1',
    component: () => import('@/views/subEntry/index.vue'),
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
  {
    path: '/printFile',
    name: 'printFile',
    component: () => import('@/views/printFile/index.vue'),
  },
  {
    path: '/showPz',
    name: 'showPz',
    component: () => import('@/views/showPz/index.vue'),
  },
  {
    path: '/chajianDemo',
    name: 'chajianDemo',
    component: () => import('@/views/chajianDemo/index.vue'),
  },
  {
    path: '/csDemo',
    name: 'csDemo',
    component: () => import('@/views/csDemo/index.vue'),
  },
  {
    path: '/docViewDemo',
    name: 'docViewDemo',
    component: () => import('@/views/docViewDemo/index.vue'),
  },
  {
    path: '/docViewDemo2',
    name: 'docViewDemo2',
    component: () => import('@/views/docViewDemo2/index.vue'),
  },
  {
    path: '/docViewDemo3',
    name: 'docViewDemo3',
    component: () => import('@/views/docViewDemo3/index.vue'),
  },
  {
    path: '/moreTable',
    name: 'moreTable',
    component: () => import('@/views/moreTable/index.vue'),
  },
  {
    path: '/uploadSlice',
    name: 'uploadSlice',
    component: () => import('@/views/uploadSlice/index.vue'),
  },
  {
    path: '/hb',
    name: 'hb',
    component: () => import('@/views/hb.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
