import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// UI Library 실습 : Element Plus 는 쓰는 컴포넌트만 각 .vue 에서 개별 import 하고(온디맨드),
// 공통 CSS 변수(--el-color-primary 등)만 여기서 한 번 불러온다.
// 전체(app.use(ElementPlus))로 등록하면 안 쓰는 컴포넌트까지 번들에 들어가 용량이 크게 늘어난다.
import 'element-plus/theme-chalk/base.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
