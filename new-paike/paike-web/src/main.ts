import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

//引入路由
import router from './router' 


const app = createApp(App)
app
.use(router)
.use(Antd)
.mount('#app')