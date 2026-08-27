<script setup>
// 03.Base Dashboard Card (컴포넌트 분할 - 공용 Base 컴포넌트)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습
// 변경사항 :
//   - 검색/리스트 박스의 공통 카드 레이아웃을 재사용 컴포넌트로 추출
//   - title prop + 기본 슬롯(<slot />)으로 구성, 스타일은 scoped 처리

defineProps({
  // 카드 상단에 표시할 제목 (없으면 제목 영역 미출력)
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="dashboard-card">
    <h3 v-if="title">{{ title }}</h3>
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}
</style>
