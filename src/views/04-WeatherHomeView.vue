<script setup>
// 04-WeatherHomeView.vue (Weather Router 실습 - '/' 메인 대시보드)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Vue Router)
// 변경사항 :
//   - 03-WetherParent 를 참고하여 '/' 경로에 매핑되는 페이지 컴포넌트로 재작성
//   - 데이터/상태/computed/watch 구조는 03 과 동일 (검색 필터, 정렬, 페이지네이션 유지)
//   - 도시 데이터는 src/data/04-cities.js 공용 Mock Data 를 사용 (03 은 인라인 데이터 유지)
//   - 03 의 자식 컴포넌트(SearchBar, WeatherCard, BaseDashboardCard, Pagination)를 그대로 재사용
//   - 상세보기 시 window.alert() 를 제거하고 Programmatic Navigation 으로 변경
//     WeatherCard 의 detail 이벤트 → router.push('/weather/' + cityId)

import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { cities, findCityIdByName } from '../data/04-cities.js'
import BaseDashboardCard from '../components/exercise/03-BaseDashboardCard.vue'
import SearchBar from '../components/exercise/03-SearchBar.vue'
import WeatherCard from '../components/exercise/03-WeatherCard.vue'
import Pagination from '../components/exercise/03-Pagination.vue'

const router = useRouter()

// 공용 Mock Data (원본 배열을 직접 건드리지 않도록 복사해서 보관)
const weatherList = ref([...cities])

// 검색어 및 상태 바 문구
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 정렬 기준 (이름순 / 온도순)
const sortOrder = ref('name')

// computed: 검색어에 맞게 필터링된 리스트
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) {
    return weatherList.value
  }
  return weatherList.value.filter((item) => item.name.includes(query))
})

// computed: 필터링된 리스트를 정렬 기준에 따라 재정렬
const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value]
  return sortOrder.value === 'temp'
    ? list.sort((a, b) => b.temp - a.temp)
    : list.sort((a, b) => a.name.localeCompare(b.name))
})

// watch / watchEffect: 값 변화 로깅 (03 과 동일)
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어 '${searchQuery.value}'로 필터링 중`)
})
watch(sortOrder, (newValue) => {
  console.log(`[watch] 정렬 기준 변경: ${newValue === 'temp' ? '온도순' : '이름순'}`)
})

// 페이지네이션
const pageSize = 4
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(sortedWeatherList.value.length / pageSize)))
const pagedWeatherList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sortedWeatherList.value.slice(start, start + pageSize)
})
watch([searchQuery, sortOrder], () => {
  currentPage.value = 1
})

const DEFAULT_INFO = '카드를 클릭하거나 검색해 보세요.'

const resetSelection = () => {
  selectedCityInfo.value = DEFAULT_INFO
}

// WeatherCard 의 select 이벤트 처리 (상태 바 갱신)
const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}

// WeatherCard 의 detail 이벤트 처리
// 03 에서는 window.alert() 였으나, 여기서는 상세 페이지로 라우팅
const goDetail = (cityName) => {
  const cityId = findCityIdByName(cityName)
  if (cityId) {
    router.push(`/weather/${cityId}`)
  }
}

// SearchBar 의 toggle-sort 이벤트 처리
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
      <p v-if="sortedWeatherList.length === 0" class="no-result">
        검색 결과와 일치하는 도시가 없습니다.
      </p>

      <WeatherCard
        v-for="item in pagedWeatherList"
        :key="item.id"
        :item="item"
        @select="selectCity"
        @detail="goDetail"
      />

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
