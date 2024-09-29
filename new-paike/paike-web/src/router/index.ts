import { createRouter,createWebHistory,RouteRecordRaw } from "vue-router";
// import Layout from '../components/HelloWorld.vue'
import Layout from '../layout/index.vue'
// 路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: Layout
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
