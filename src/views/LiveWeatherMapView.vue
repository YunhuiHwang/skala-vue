<script setup>
// LiveWeatherMapView.vue (Weather Axios 실습 - '/live' 실시간 수도권 날씨 지도)
// 작성목적 : OpenWeatherMap 으로 대표 도시 8곳의 실시간 날씨를 조회해
//           수도권 시군구 지도에 "비 오는 지역"을 하늘색으로 표시하고,
//           지도 양옆에 대표 도시 카드를 배치한다.
// 흐름     : 카드 또는 지도 클릭 -> /live/:repCityId 상세 페이지로 이동
//           (상세 페이지에서 날씨 상세 + Kakao 로컬 API 로 "전" 맛집 3곳 링크 표시)

import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLiveWeatherStore } from '../stores/liveWeatherStore.js'
import { representativeCities } from '../data/representativeCities.js'
import KoreaCapitalMap from '../components/live/KoreaCapitalMap.vue'
import RepCityCard from '../components/live/RepCityCard.vue'

const router = useRouter()
const liveWeatherStore = useLiveWeatherStore()

onMounted(() => {
  liveWeatherStore.loadTodayWeather()
})

const leftCities = computed(() => representativeCities.slice(0, 4))
const rightCities = computed(() => representativeCities.slice(4))

const goDetail = (repCityId) => {
  router.push(`/live/${repCityId}`)
}

const onSelectRegion = ({ repCityId }) => {
  if (repCityId) goDetail(repCityId)
}
</script>

<template>
  <div class="live-wrapper">
    <h2>🌧 비 오는 날엔 전이지 - 수도권 실시간 날씨</h2>
    <p class="hint">
      지도에서 지역을 클릭하거나, 좌우 카드를 눌러 상세 날씨와 근처 전 맛집을 확인하세요.
    </p>

    <p v-if="liveWeatherStore.error" class="error-text">
      날씨를 불러오지 못했습니다: {{ liveWeatherStore.error }}
    </p>

    <div class="live-layout">
      <div class="rep-column">
        <RepCityCard
          v-for="city in leftCities"
          :key="city.id"
          :city="city"
          :weather="liveWeatherStore.getWeatherById(city.id)"
          @click="goDetail"
        />
      </div>

      <div class="map-column">
        <p v-if="liveWeatherStore.loading" class="loading-text">날씨 불러오는 중...</p>
        <KoreaCapitalMap
          :rainy-rep-city-ids="liveWeatherStore.rainyRepCityIds"
          @select-region="onSelectRegion"
        />
      </div>

      <div class="rep-column">
        <RepCityCard
          v-for="city in rightCities"
          :key="city.id"
          :city="city"
          :weather="liveWeatherStore.getWeatherById(city.id)"
          @click="goDetail"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.live-wrapper {
  max-width: 900px;
  margin: 0 auto;
  color: black;
  text-align: center;
}

.hint {
  color: #868e96;
  font-size: 13px;
  margin-bottom: 16px;
}

.error-text {
  color: #e03131;
  margin-bottom: 12px;
}

.loading-text {
  color: #868e96;
  margin-bottom: 8px;
}

.live-layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.rep-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.map-column {
  flex: 1 1 320px;
  min-width: 280px;
  max-width: 520px;
}
</style>
