<script setup>
// 04-WeatherStatsView.vue (Weather Router 실습 - '/stats' 통계 요약, 본인 추가 view)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Vue Router)
// 변경사항 :
//   - 과제 요구사항 6번(정의된 view 외 본인 추가 view + 라우팅)으로 작성
//   - 공용 Mock Data 를 computed 로 집계 (도시 수 / 평균 기온 / 최고·최저 도시 / 상태별 분포)
//   - 최고·최저 도시 이름을 클릭하면 해당 도시 상세 페이지로 RouterLink 이동

import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { cities } from '../data/04-cities.js'

const count = computed(() => cities.length)

const avgTemp = computed(() => {
  const sum = cities.reduce((acc, city) => acc + city.temp, 0)
  return (sum / cities.length).toFixed(1)
})

const hottest = computed(() => cities.reduce((max, city) => (city.temp > max.temp ? city : max)))

const coldest = computed(() => cities.reduce((min, city) => (city.temp < min.temp ? city : min)))

// 상태별 도시 수 { '맑음': 5, ... }
const statusCount = computed(() =>
  cities.reduce((acc, city) => {
    acc[city.status] = (acc[city.status] ?? 0) + 1
    return acc
  }, {}),
)
</script>

<template>
  <div class="dashboard-wrapper">
    <h2>날씨 통계 요약</h2>

    <div class="stats-grid">
      <div class="stat-box">
        <span class="stat-label">표시 도시</span>
        <strong class="stat-value">{{ count }}개</strong>
      </div>
      <div class="stat-box">
        <span class="stat-label">평균 현재기온</span>
        <strong class="stat-value">{{ avgTemp }}°C</strong>
      </div>
      <div class="stat-box">
        <span class="stat-label">가장 더운 도시</span>
        <strong class="stat-value">
          <RouterLink :to="`/weather/${hottest.id}`">{{ hottest.name }}</RouterLink>
          {{ hottest.temp }}°C
        </strong>
      </div>
      <div class="stat-box">
        <span class="stat-label">가장 추운 도시</span>
        <strong class="stat-value">
          <RouterLink :to="`/weather/${coldest.id}`">{{ coldest.name }}</RouterLink>
          {{ coldest.temp }}°C
        </strong>
      </div>
    </div>

    <div class="status-dist">
      <h3>상태별 분포</h3>
      <ul>
        <li v-for="(num, status) in statusCount" :key="status">
          <span>{{ status }}</span>
          <strong>{{ num }}개</strong>
        </li>
      </ul>
    </div>

    <RouterLink class="btn-sort" to="/">← 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}

.stat-box {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  color: #868e96;
  font-size: 13px;
}

.stat-value {
  font-size: 18px;
}

.status-dist {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 14px;
  margin-bottom: 15px;
}

.status-dist ul {
  list-style: none;
  padding: 0;
  margin: 8px 0 0;
}

.status-dist li {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-top: 1px solid #f1f3f5;
}

.btn-sort {
  display: inline-block;
  text-decoration: none;
  color: #495057;
}
</style>
