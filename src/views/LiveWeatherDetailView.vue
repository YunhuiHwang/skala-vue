<script setup>
// LiveWeatherDetailView.vue (Weather Axios 실습 - '/live/:repCityId' 상세)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Axios)
// 변경사항 :
//   - 대표 도시의 실시간 날씨 상세 + Kakao 로컬 API 로 "{도시} 전" 맛집 상위 3곳 링크 표시
//   - 상세로 바로 진입(새로고침)한 경우를 대비해 store 에 데이터가 없으면 mount 시점에 다시 로드

import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLiveWeatherStore } from '../stores/liveWeatherStore.js'
import { findRepCity } from '../data/representativeCities.js'
import { searchJeonRestaurants } from '../services/kakaoLocalClient.js'

const route = useRoute()
const router = useRouter()
const liveWeatherStore = useLiveWeatherStore()

const city = ref(null)
const restaurants = ref([])
const restaurantLoading = ref(false)
const restaurantError = ref(null)

const loadDetail = async (repCityId) => {
  city.value = findRepCity(repCityId)
  if (!city.value) return

  if (Object.keys(liveWeatherStore.cityWeatherMap).length === 0) {
    await liveWeatherStore.loadTodayWeather()
  }

  restaurantLoading.value = true
  restaurantError.value = null
  try {
    restaurants.value = await searchJeonRestaurants(city.value.name)
  } catch (err) {
    restaurantError.value = err.message
  } finally {
    restaurantLoading.value = false
  }
}

onMounted(() => loadDetail(route.params.repCityId))
watch(
  () => route.params.repCityId,
  (newId) => loadDetail(newId),
)

const weather = ref(null)
watch(
  () => liveWeatherStore.cityWeatherMap,
  () => {
    weather.value = city.value ? liveWeatherStore.getWeatherById(city.value.id) : null
  },
  { immediate: true, deep: true },
)

const goBack = () => router.push('/live')
</script>

<template>
  <div class="live-wrapper">
    <template v-if="city">
      <h2>{{ city.name }} 상세 날씨</h2>

      <div v-if="weather" class="detail-card">
        <p class="detail-status">
          현재 상태: <strong>{{ weather.isRaining ? '☔ ' : '' }}{{ weather.description }}</strong>
        </p>
        <ul class="detail-list">
          <li>
            <span>현재 기온</span><strong>{{ weather.temp }}℃</strong>
          </li>
          <li>
            <span>최저 / 최고</span><strong>{{ weather.min }}℃ / {{ weather.max }}℃</strong>
          </li>
          <li>
            <span>습도</span><strong>{{ weather.humidity }}%</strong>
          </li>
          <li>
            <span>풍속</span><strong>{{ weather.wind }} m/s</strong>
          </li>
          <li>
            <span>기압</span><strong>{{ weather.pressure }} hPa</strong>
          </li>
        </ul>
      </div>
      <p v-else class="loading-text">날씨 불러오는 중...</p>

      <div class="restaurant-section">
        <h3>🥞 {{ city.name }} 근처 전 맛집</h3>
        <p v-if="restaurantLoading" class="loading-text">맛집 검색 중...</p>
        <p v-else-if="restaurantError" class="error-text">맛집 검색 실패: {{ restaurantError }}</p>
        <ul v-else-if="restaurants.length > 0" class="restaurant-list">
          <li v-for="place in restaurants" :key="place.id">
            <a :href="place.url" target="_blank" rel="noopener noreferrer">{{ place.name }}</a>
            <span class="restaurant-address">{{ place.address }}</span>
          </li>
        </ul>
        <p v-else class="no-result">검색 결과가 없습니다.</p>
      </div>

      <button class="btn-sort" @click="goBack">← 지도로 돌아가기</button>
    </template>

    <template v-else>
      <p class="no-result">'{{ route.params.repCityId }}' 에 해당하는 도시를 찾을 수 없습니다.</p>
      <button class="btn-sort" @click="goBack">← 지도로 돌아가기</button>
    </template>
  </div>
</template>

<style scoped>
.live-wrapper {
  max-width: 600px;
  margin: 0 auto;
  color: black;
}

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

.restaurant-section {
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 15px;
  text-align: left;
}

.restaurant-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.restaurant-list li {
  padding: 8px 0;
  border-top: 1px solid #f1f3f5;
  display: flex;
  flex-direction: column;
}

.restaurant-list li:first-child {
  border-top: none;
}

.restaurant-address {
  font-size: 12px;
  color: #868e96;
}

.loading-text {
  color: #868e96;
}

.error-text {
  color: #e03131;
}
</style>
