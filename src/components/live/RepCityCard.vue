<script setup>
// RepCityCard.vue (Weather Axios 실습 - 지도 양옆에 배치되는 대표 도시 카드)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Axios)
// 변경사항 :
//   - city / weather props 를 받아 도시명·기온·상태를 표시, 클릭 시 click 이벤트 emit
//   - 비 오는 도시는 카드 배경을 하늘색 계열로 강조
//   - [UI Library] 직접 만든 button 카드를 Element Plus 의 ElCard 로 교체
//     ElCard 는 클릭 이벤트가 없는 표시용 컴포넌트라 native @click 으로 연결하고,
//     키보드로도 이동할 수 있도록 role/tabindex 와 Enter·Space 처리를 함께 둔다

import { ElCard } from 'element-plus'
import 'element-plus/theme-chalk/el-card.css'

defineProps({
  city: {
    type: Object,
    required: true,
  },
  weather: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <ElCard
    class="rep-city-card"
    :class="{ rainy: weather?.isRaining }"
    shadow="hover"
    role="button"
    tabindex="0"
    @click="emit('click', city.id)"
    @keydown.enter.prevent="emit('click', city.id)"
    @keydown.space.prevent="emit('click', city.id)"
  >
    <div class="rep-city-name">{{ city.name }}</div>
    <template v-if="weather">
      <div class="rep-city-temp">{{ weather.temp }}℃</div>
      <div class="rep-city-desc">{{ weather.isRaining ? '☔ ' : '' }}{{ weather.description }}</div>
    </template>
    <div v-else class="rep-city-desc">불러오는 중...</div>
  </ElCard>
</template>

<style scoped>
.rep-city-card {
  width: 110px;
  cursor: pointer;
  text-align: left;
  --el-card-padding: 10px;
}

.rep-city-card.rainy {
  --el-card-bg-color: #eaf6ff;
  border-color: #87ceeb;
}

.rep-city-card:hover {
  border-color: #0984e3;
}

.rep-city-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.rep-city-temp {
  font-size: 18px;
  margin-bottom: 2px;
}

.rep-city-desc {
  font-size: 12px;
  color: #868e96;
}
</style>
