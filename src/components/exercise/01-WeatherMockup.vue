<script setup>
// 01.Weather Mockup
// 작성자 : P068 황윤희
// 작성일 : 2026-08-25
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습
// 변경사항 :
//   - 도시 10개로 확장, min/max 필드 추가, status 4종 확장
//   - v-if 조건을 status+min 기준으로 변경
//   - 카드 외 영역 클릭 시 선택 초기화 기능 추가

import { ref } from 'vue'

// 날씨 데이터 (최저기온/최고기온 추가 및 데이터 추가)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 30, min: 24, max: 31, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, min: 20, max: 28, status: '맑음' },
  { id: 'city_03', name: '부산', temp: 32, min: 28, max: 35, status: '구름많음' },
  { id: 'city_04', name: '제주', temp: 22, min: 18, max: 25, status: '흐림' },
  { id: 'city_05', name: '대전', temp: 30, min: 26, max: 33, status: '맑음' },
  { id: 'city_06', name: '광주', temp: 27, min: 23, max: 30, status: '비' },
  { id: 'city_07', name: '대구', temp: 35, min: 30, max: 40, status: '맑음' },
  { id: 'city_08', name: '강릉', temp: 23, min: 19, max: 27, status: '구름많음' },
  { id: 'city_09', name: '인천', temp: 21, min: 17, max: 25, status: '흐림' },
  { id: 'city_10', name: '울산', temp: 33, min: 29, max: 37, status: '맑음' },
])

// 검색어 및 알림창 제어 (v-model 한글 처리 및 이벤트 실습용)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper" @click="selectedCityInfo = '카드를 클릭하거나 검색해 보세요.'">
    <section class="search-box">
      <h3>도시 검색</h3>
      <!-- v-model 대신 :value와 @input 사용 -->
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>지역별 날씨 현황</h3>

      <div
        v-for="item in weatherList"
        :key="item.id"
        class="weather-card"
        @click.stop="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>
        <p>최저 기온: {{ item.min }}°C/최고 기온: {{ item.max }}°C</p>

        <!-- 본인만의 조건으로 변경한 v-if -->
        <span v-if="item.status === '비'" class="badge rain">☔ 우산 챙기세요</span>
        <span v-else-if="item.min >= 25" class="badge tropical">🌙 열대야 조심</span>
        <span v-else-if="item.status === '맑음'" class="badge sunny">☀️ 맑음</span>

        <!-- 버블링 없이 alert 창 띄우기 위해 .stop 수식어 사용 -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
