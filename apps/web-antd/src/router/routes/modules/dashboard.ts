import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    name: 'Analytics',
    path: '/analytics',
    component: () => import('#/views/dashboard/analytics/index.vue'),
    meta: {
      // icon: 'lucide:area-chart',
      title: '总览',
      keepAlive: true,
    },
  },
  {
    name: 'Equ ',
    path: '/equ',
    component: () => import('#/views/dashboard/equ/index.vue'),
    meta: {
      // icon: 'lucide:area-chart',
      title: '设备管理',
    },
  },
  {
    name: 'Task ',
    path: '/task',
    component: () => import('#/views/dashboard/task/index.vue'),
    meta: {
      // icon: 'lucide:area-chart',
      title: '任务管理',
    },
  },
  {
    name: 'MessageDetail',
    path: '/messageDetail',
    component: () =>
      import('#/views/dashboard/analytics/components/detail.vue'),
    meta: {
      // icon: 'lucide:area-chart',
      title: '消息详情',
      hideInMenu: true,
      // hideInTab: true,
    },
  },
];

export default routes;
