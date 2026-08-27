<script setup>
// KoreaCapitalMap.vue (Weather Axios 실습 - 수도권 시군구 지도)
// 작성목적 : southkorea-maps(GADM) 시군구 경계 데이터를 D3 로 투영해 SVG path 로 렌더링한다.
//           비가 오는 대표 도시(repCity)에 속한 시군구는 하늘색으로 칠한다.
// 참고     : DOM 을 직접 조작하지 않고, 각 지역의 path "d" 문자열을 computed 로 계산해
//           Vue 템플릿에서 v-for 로 그리는 방식(선언적) 을 사용했다.

import { computed } from 'vue'
import * as d3 from 'd3'
import capitalGeoJson from '../../data/capital-region.geo.json'

const props = defineProps({
  rainyRepCityIds: {
    type: Array,
    default: () => [],
  },
  selectedRepCityId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['select-region'])

const width = 520
const height = 560

const projection = d3.geoMercator().fitSize([width, height], capitalGeoJson)
const pathGenerator = d3.geoPath(projection)

const regions = computed(() =>
  capitalGeoJson.features.map((feature) => {
    const isRainy = props.rainyRepCityIds.includes(feature.properties.repCity)
    const isSelected = props.selectedRepCityId === feature.properties.repCity
    return {
      key: `${feature.properties.NAME_1}-${feature.properties.NAME_2}`,
      d: pathGenerator(feature),
      nameKo: feature.properties.nameKo,
      repCity: feature.properties.repCity,
      fill: isRainy ? '#7cc4e8' : '#dee2e6',
      stroke: isSelected ? '#0984e3' : '#6c757d',
      strokeWidth: isSelected ? 2 : 1,
    }
  }),
)

const onRegionClick = (region) => {
  emit('select-region', { repCityId: region.repCity, nameKo: region.nameKo })
}
</script>

<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    preserveAspectRatio="xMidYMid meet"
    class="capital-map"
    role="img"
    aria-label="수도권 시군구 지도"
  >
    <path
      v-for="region in regions"
      :key="region.key"
      :d="region.d"
      :fill="region.fill"
      :stroke="region.stroke"
      :stroke-width="region.strokeWidth"
      class="region-path"
      @click="onRegionClick(region)"
    >
      <title>{{ region.nameKo }}</title>
    </path>
  </svg>
</template>

<style scoped>
.capital-map {
  width: 100%;
  max-width: 520px;
  aspect-ratio: 520 / 560;
  height: auto;
  display: block;
  margin: 0 auto;
  background: #f8fbff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
}

.region-path {
  cursor: pointer;
  transition: fill 0.2s ease;
}

.region-path:hover {
  fill: #74b9ff !important;
}
</style>
