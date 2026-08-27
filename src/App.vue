<script setup>
// App.vue (Weather Router 실습 - 앱 셸)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Vue Router)
// 변경사항 :
//   - 01/02/03 컴포넌트를 세로로 쌓아 렌더하던 방식을 제거
//   - 상단 내비게이션 바(<RouterLink>)와 메인 콘텐츠 영역(<RouterView />)만 배치
//   - 화면 전환은 전부 라우터가 담당 (전체 새로고침 없는 SPA 네비게이션)
//   - 01/02/03 실습 파일은 components/exercise/ 에 그대로 보존 (라우팅에서는 제외)

import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-nav">
    <strong class="brand">🌦 Weather</strong>
    <nav>
      <RouterLink to="/">대시보드</RouterLink>
      <RouterLink to="/stats">통계</RouterLink>
      <RouterLink to="/about">소개</RouterLink>
    </nav>
  </header>

  <main class="app-main">
    <RouterView />
  </main>
</template>

<style>
@import '@/assets/exercise.css';
</style>

<style scoped>
.app-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto 20px;
  padding: 12px 15px;
  border-bottom: 2px solid #e9ecef;
}

.app-nav .brand {
  font-size: 18px;
}

.app-nav nav {
  display: flex;
  gap: 14px;
}

.app-nav a {
  color: #495057;
  text-decoration: none;
  font-weight: bold;
}

/* 현재 경로와 정확히 일치하는 링크에 라우터가 자동으로 붙여주는 클래스 */
.app-nav a.router-link-exact-active {
  color: #0984e3;
  border-bottom: 2px solid #0984e3;
}
</style>
