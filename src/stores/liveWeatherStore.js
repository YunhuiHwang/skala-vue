// liveWeatherStore.js (Weather Axios 실습 - 실시간 수도권 지도용 상태)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Axios)
// 변경사항 :
//   - 대표 도시 8곳의 실시간 날씨를 OpenWeatherMap 에서 조회해 보관
//   - 오늘 날짜를 키에 포함한 localStorage 캐싱으로 하루 한 번만 실제 API 호출 (자정 지나면 키 변경)
//   - loading / error 상태를 노출해 지도·카드 쪽에서 로딩 UI 표시 가능

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { representativeCities } from '../data/representativeCities.js'
import { fetchRepresentativeCitiesWeather } from '../services/owmClient.js'

function todayCacheKey() {
  const today = new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'
  return `live_weather_cache_${today}`
}

function readCache() {
  const raw = localStorage.getItem(todayCacheKey())
  return raw ? JSON.parse(raw) : null
}

function writeCache(data) {
  localStorage.setItem(todayCacheKey(), JSON.stringify(data))
}

export const useLiveWeatherStore = defineStore('liveWeather', () => {
  // state
  const cityWeatherMap = ref({}) // { [repCityId]: weatherResult }
  const loading = ref(false)
  const error = ref(null)
  const lastLoadedAt = ref(null)

  // getter: 비가 오는 대표 도시 id 목록
  const rainyRepCityIds = computed(() =>
    Object.values(cityWeatherMap.value)
      .filter((w) => w.isRaining)
      .map((w) => w.id),
  )

  function getWeatherById(repCityId) {
    return cityWeatherMap.value[repCityId] ?? null
  }

  // action: 캐시가 있으면 캐시 사용, 없으면 실제 API 호출 후 캐싱
  async function loadTodayWeather({ force = false } = {}) {
    if (!force) {
      const cached = readCache()
      if (cached) {
        cityWeatherMap.value = cached
        return
      }
    }

    loading.value = true
    error.value = null
    try {
      const results = await fetchRepresentativeCitiesWeather(representativeCities)
      const map = Object.fromEntries(results.map((w) => [w.id, w]))
      cityWeatherMap.value = map
      lastLoadedAt.value = new Date().toISOString()
      writeCache(map)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    cityWeatherMap,
    loading,
    error,
    lastLoadedAt,
    rainyRepCityIds,
    getWeatherById,
    loadTodayWeather,
  }
})
