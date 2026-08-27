<script setup>
// 04-WeatherDetailView.vue (Weather Router 실습 - '/weather/:cityId' 도시 상세)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Vue Router)
// 변경사항 :
//   - Dynamic Route Matching 으로 전달된 :cityId 를 useRoute() 로 수신
//   - Mount 시점(onMounted)에 cityId 로 Mock Data 에서 도시 객체를 선택
//   - 도시 상세 기상관측 정보(현재/최저/최고 기온, 습도, 풍속, 강수확률, 기압) 표시
//   - 잘못된 cityId 로 접근하면 안내 문구 + 대시보드 복귀 링크 노출
//   - :cityId 만 바뀌는 이동(상세 → 상세)에도 대응하도록 route.params 변화를 watch

import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCity } from '../data/04-cities.js'

const route = useRoute()
const router = useRouter()

// 현재 화면에 표시할 도시 객체 (없으면 null)
const city = ref(null)

// cityId 로 Mock Data 조회 후 city 에 반영
const loadCity = (cityId) => {
  city.value = findCity(cityId)
  console.log('[04-WeatherDetailView] 현재 경로:', route.path, '/ cityId:', cityId)
}

onMounted(() => {
  loadCity(route.params.cityId)
})

// /weather/city_01 → /weather/city_02 처럼 파라미터만 바뀌는 경우 컴포넌트가
// 재사용되므로 onMounted 가 다시 안 불린다. params 변화를 직접 감시해서 갱신.
watch(
  () => route.params.cityId,
  (newId) => {
    loadCity(newId)
  },
)

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="dashboard-wrapper">
    <template v-if="city">
      <h2>{{ city.name }} 상세 기상정보</h2>

      <div class="detail-card">
        <p class="detail-status">
          현재 상태: <strong>{{ city.status }}</strong>
        </p>
        <ul class="detail-list">
          <li>
            <span>현재 기온</span><strong>{{ city.temp }}°C</strong>
          </li>
          <li>
            <span>최저 / 최고</span><strong>{{ city.min }}°C / {{ city.max }}°C</strong>
          </li>
          <li>
            <span>습도</span><strong>{{ city.humidity }}%</strong>
          </li>
          <li>
            <span>풍속</span><strong>{{ city.wind }} m/s</strong>
          </li>
          <li>
            <span>강수 확률</span><strong>{{ city.rainProb }}%</strong>
          </li>
          <li>
            <span>기압</span><strong>{{ city.pressure }} hPa</strong>
          </li>
        </ul>
      </div>

      <button class="btn-sort" @click="goHome">← 대시보드로 돌아가기</button>
    </template>

    <template v-else>
      <p class="no-result">'{{ route.params.cityId }}' 에 해당하는 도시를 찾을 수 없습니다.</p>
      <button class="btn-sort" @click="goHome">← 대시보드로 돌아가기</button>
    </template>
  </div>
</template>

<style scoped>
.detail-card {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 15px;
}

.detail-status {
  margin-bottom: 12px;
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px solid #f1f3f5;
}

.detail-list li:first-child {
  border-top: none;
}

.detail-list span {
  color: #868e96;
}
</style>
