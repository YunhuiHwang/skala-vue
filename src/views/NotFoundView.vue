<script setup>
// NotFoundView.vue (Weather Router 실습 - Catch-all Route 대상)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Vue Router)
// 변경사항 :
//   - router 의 '/:pathMatch(.*)*' Catch-all Route 에 매핑되는 404 페이지
//   - 정의되지 않은 경로 접근 시 빈 화면 대신 안내 + 대시보드 복귀 링크 제공

import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="dashboard-wrapper">
    <h2>404 - 페이지를 찾을 수 없습니다</h2>
    <p class="no-result">요청하신 경로 '{{ route.path }}' 는 존재하지 않습니다.</p>
    <RouterLink class="btn-sort" to="/">← 홈으로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.btn-sort {
  display: inline-block;
  text-decoration: none;
  color: #495057;
}
</style>
