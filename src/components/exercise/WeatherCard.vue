<script setup>
// WeatherCard.vue (컴포넌트 분할 - 날씨 카드 자식)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습
// 변경사항 :
//   - 반복되던 날씨 카드 1개를 자식 컴포넌트로 분리
//   - item prop 으로 도시 1건을 받아 표시, select / detail 을 emit
//   - 버블링 방지를 위해 클릭 핸들러에 @click.stop 유지
//   - [Store] configStore.unit 에 따라 기온(현재/최저/최고)을 섭씨·화씨로 변환해 표시
//     (뱃지 조건은 원본 섭씨 기준 그대로 유지)

import { useConfigStore } from '../../stores/configStore.js'

defineProps({
  // 날씨 도시 1건 { id, name, temp, min, max, status }
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select', 'detail'])

const configStore = useConfigStore()

// 섭씨 숫자 → 현재 단위 표시 문자열 (예: "28℃" / "82℉")
const formatTemp = (celsius) => {
  const value = configStore.unit === 'fahrenheit' ? Math.round((celsius * 9) / 5 + 32) : celsius
  return `${value}${configStore.unitSymbol}`
}
</script>

<template>
  <div class="weather-card" @click.stop="emit('select', item.name)">
    <h4>{{ item.name }} ({{ item.status }})</h4>
    <p>현재 기온: {{ formatTemp(item.temp) }}</p>
    <p>최저 기온: {{ formatTemp(item.min) }} / 최고 기온: {{ formatTemp(item.max) }}</p>

    <!-- Mockup과 동일한 조건 (status + min 기준) -->
    <span v-if="item.status === '비'" class="badge rain">☔ 우산 챙기세요</span>
    <span v-else-if="item.min >= 25" class="badge tropical">🌙 열대야 조심</span>
    <span v-else-if="item.status === '맑음'" class="badge sunny">☀️ 맑음</span>

    <!-- 버블링 없이 상세보기 이벤트만 올려보내기 위해 .stop 사용 -->
    <button class="btn-detail" @click.stop="emit('detail', item.name, item.status)">
      상세보기
    </button>
  </div>
</template>
