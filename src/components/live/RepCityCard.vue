<script setup>
// RepCityCard.vue (Weather Axios 실습 - 지도 양옆에 배치되는 대표 도시 카드)

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
  <button
    class="rep-city-card"
    :class="{ rainy: weather?.isRaining }"
    @click="emit('click', city.id)"
  >
    <div class="rep-city-name">{{ city.name }}</div>
    <template v-if="weather">
      <div class="rep-city-temp">{{ weather.temp }}℃</div>
      <div class="rep-city-desc">{{ weather.isRaining ? '☔ ' : '' }}{{ weather.description }}</div>
    </template>
    <div v-else class="rep-city-desc">불러오는 중...</div>
  </button>
</template>

<style scoped>
.rep-city-card {
  display: block;
  width: 110px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 10px;
  text-align: left;
  cursor: pointer;
  font: inherit;
}

.rep-city-card.rainy {
  background: #eaf6ff;
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
