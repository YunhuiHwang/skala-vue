// configStore.js (Weather Store 실습 - 온도 단위 전역 상태)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Pinia)
// 변경사항 :
//   - 온도 단위(섭씨/화씨)를 앱 전체에서 공유하는 스토어 신규 작성
//   - state: unit (초기값 'celsius'), getter: unitSymbol (℃ / ℉), action: toggleUnit (두 값 토글)
//   - setup store 스타일(함수형)로 정의하고 use+파일명+Store 규칙에 따라 useConfigStore 로 export

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  // state: 현재 단위 ('celsius' | 'fahrenheit')
  const unit = ref('celsius')

  // getter: 현재 단위에 대응하는 기호
  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))

  // action: 섭씨 ↔ 화씨 토글
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return { unit, unitSymbol, toggleUnit }
})
