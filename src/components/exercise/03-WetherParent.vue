<script setup>
// 03.Weather Parent (컴포넌트 분할 - 부모/컨테이너)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습
// 변경사항 :
//   - 02 한 파일을 부모(이 파일) + 자식 4종(SearchBar / WeatherCard / BaseDashboardCard / Pagination)으로 분할
//   - 모든 반응형 데이터/computed/watch 는 부모가 소유, 자식과는 props / emit 으로 통신
//   - 본인 추가 기능: 페이지네이션(currentPage, totalPages, pagedWeatherList)

import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './03-BaseDashboardCard.vue'
import SearchBar from './03-SearchBar.vue'
import WeatherCard from './03-WeatherCard.vue'
import Pagination from './03-Pagination.vue'

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

// 검색어 및 알림창 제어
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 본인만의 반응형 상태: 정렬 기준 (이름순 / 온도순)
const sortOrder = ref('name')

// computed: 검색어에 맞게 필터링된 리스트
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) {
    return weatherList.value
  }
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 본인만의 computed: 필터링된 리스트를 정렬 기준에 따라 재정렬
const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value]
  return sortOrder.value === 'temp'
    ? list.sort((a, b) => b.temp - a.temp)
    : list.sort((a, b) => a.name.localeCompare(b.name))
})

// watch: 상태바 문구가 바뀔 때마다 콘솔로그
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// watchEffect: 검색어가 바뀔 때마다 자동으로 추적
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어 '${searchQuery.value}'로 필터링 중`)
})

// 본인만의 watch: 정렬 기준이 바뀔 때마다 로그
watch(sortOrder, (newValue) => {
  console.log(`[watch] 정렬 기준 변경: ${newValue === 'temp' ? '온도순' : '이름순'}`)
})

// 본인 추가 기능: 페이지네이션
const pageSize = 4 // 한 페이지에 보여줄 카드 수
const currentPage = ref(1)

// 정렬된 전체 리스트 기준 전체 페이지 수 (최소 1)
const totalPages = computed(() => Math.max(1, Math.ceil(sortedWeatherList.value.length / pageSize)))

// 현재 페이지에 해당하는 만큼만 잘라낸 리스트
const pagedWeatherList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedWeatherList.value.slice(start, start + pageSize)
})

// 검색어나 정렬 기준이 바뀌면 1페이지로 되돌림 (빈 페이지 방지)
watch([searchQuery, sortOrder], () => {
  currentPage.value = 1
})

// 초기 상태바 문구
const DEFAULT_INFO = '카드를 클릭하거나 검색해 보세요.'

// 카드 밖(빈 영역/검색창) 클릭 시 선택 초기화
const resetSelection = () => {
  selectedCityInfo.value = DEFAULT_INFO
}

// WeatherCard 의 select emit 처리
const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

// WeatherCard 의 detail emit 처리 (alert 대행)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// SearchBar 의 toggle-sort emit 처리
const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'name' ? 'temp' : 'name'
}
</script>

<template>
  <div class="dashboard-wrapper" @click="resetSelection">
    <SearchBar
      :search-query="searchQuery"
      :sort-order="sortOrder"
      @update:search-query="searchQuery = $event"
      @toggle-sort="toggleSort"
    />

    <BaseDashboardCard title="지역별 날씨 현황">
      <!-- 검색 결과가 없을 때 안내 문구 -->
      <p v-if="sortedWeatherList.length === 0" class="no-result">
        검색 결과와 일치하는 도시가 없습니다.
      </p>

      <WeatherCard
        v-for="item in pagedWeatherList"
        :key="item.id"
        :item="item"
        @select="selectCity"
        @detail="showDetail"
      />

      <!-- 본인만의 컴포넌트: 페이지가 2개 이상일 때만 노출 -->
      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:current-page="currentPage = $event"
      />
    </BaseDashboardCard>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
