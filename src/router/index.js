// router/index.js (Weather Router 실습 - 라우트 규칙 정의)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Vue Router)
// 변경사항 :
//   - 기존 HomeView 단일 라우트를 Weather Router 과제 요구사항에 맞게 재구성
//   - '/' 는 진입 화면이라 정적 import, 나머지는 동적 import 로 지연 로딩(Lazy Loading) 적용
//   - '/weather/:cityId' 동적 경로 매칭으로 도시 상세 페이지 처리
//   - '/stats' 는 요구사항 6번(본인 추가 view) - 도시 통계 요약 페이지
//   - 목록 최하단에 Catch-all Route 배치 → 정의되지 않은 경로는 NotFoundView
//   - [Axios] '/live'(수도권 실시간 날씨 지도), '/live/:repCityId'(상세 + 전 맛집) 라우트 추가
//   - [Showcase] '/' → '/live' 리다이렉트, '/practice'(단계별 쇼케이스) 추가, 날씨 앱은 '/dashboard' 하위로 이동

import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '../views/WeatherHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 사이트 진입 시 실시간 날씨 지도로
      path: '/',
      redirect: '/live',
    },
    {
      path: '/live',
      name: 'live-map',
      component: () => import('../views/LiveWeatherMapView.vue'),
    },
    {
      path: '/live/:repCityId',
      name: 'live-detail',
      component: () => import('../views/LiveWeatherDetailView.vue'),
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('../views/PracticeView.vue'),
    },
    {
      path: '/dashboard',
      name: 'home',
      component: WeatherHomeView,
    },
    {
      path: '/dashboard/weather/:cityId',
      name: 'weather-detail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/dashboard/about',
      name: 'about',
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/dashboard/stats',
      name: 'stats',
      component: () => import('../views/WeatherStatsView.vue'),
    },
    {
      // Catch-all Route : 위 라우트와 매칭되지 않는 모든 경로 (반드시 최하단)
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
