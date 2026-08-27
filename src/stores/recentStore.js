// recentStore.js (Weather Store 실습 - 본인 추가 스토어)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Pinia)
// 변경사항 :
//   - 요구사항 4번(본인만의 추가 스토어): "최근 본 도시" 기록
//   - state: recentCityIds (최근 조회한 도시 id 배열, 최신순)
//   - getter: recentCities (id 배열 → cities Mock Data 의 도시 객체 배열로 변환)
//   - action: addRecentView(cityId) (중복 제거 후 맨 앞에 추가, 최대 5개 유지)
//   - 라우터로 화면을 이동해 컴포넌트가 언마운트돼도 스토어는 살아있으므로 기록이 유지됨

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { findCity } from '../data/cities.js'

export const useRecentStore = defineStore('recent', () => {
  // state: 최근 본 도시 id (index 0 이 가장 최근)
  const recentCityIds = ref([])

  // getter: id 배열을 실제 도시 객체 배열로 변환 (없는 id 는 걸러냄)
  const recentCities = computed(() =>
    recentCityIds.value.map((id) => findCity(id)).filter((city) => city !== null),
  )

  // action: 도시를 최근 목록 맨 앞에 추가 (이미 있으면 위치만 갱신, 최대 5개)
  function addRecentView(cityId) {
    if (!cityId) return
    recentCityIds.value = [cityId, ...recentCityIds.value.filter((id) => id !== cityId)].slice(0, 5)
  }

  return { recentCityIds, recentCities, addRecentView }
})
