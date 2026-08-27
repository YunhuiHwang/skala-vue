<script setup>
// 04-WeatherAboutView.vue (Weather Router 실습 - '/about' 소개 페이지)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Vue Router)
// 변경사항 :
//   - RouterView 에 직접 매핑되는 정적 소개 페이지
//   - 메인 대시보드로 돌아가는 RouterLink 배치

import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="dashboard-wrapper">
    <h2>서비스 소개</h2>

    <div class="about-box">
      <p>
        Vue 3와 Vue Router로 만든 날씨 대시보드입니다. 도시별 현재 기온과 날씨 상태를 한눈에
        확인하고, 이름으로 검색하거나 기온·이름순으로 정렬해 원하는 도시를 빠르게 찾을 수 있습니다.
      </p>
      <p>
        날씨 카드의 <strong>상세보기</strong>를 누르면 해당 도시의 상세 기상 페이지로 이동하며,
        화면이 바뀌어도 전체 새로고침 없이 필요한 부분만 교체되는 SPA 방식으로 동작합니다. 표시되는
        값은 실제 관측치가 아닌 실습용 Mock 데이터입니다.
      </p>
    </div>

    <RouterLink class="btn-sort" to="/">← 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.about-box {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 15px;
  line-height: 1.7;
}

.btn-sort {
  display: inline-block;
  text-decoration: none;
  color: #495057;
}
</style>
