<script setup>
// KoreaCapitalMap.vue (Weather Axios 실습 - 수도권 시군구 지도)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Axios)
// 변경사항 :
//   - southkorea-maps(GADM) 시군구 경계 데이터를 D3 로 투영해 SVG path 로 렌더링
//   - 비 오는 대표 도시(repCity)에 속한 시군구는 하늘색으로 칠함
//   - DOM 직접 조작 없이 각 지역의 path "d" 를 computed 로 계산해 v-for 로 그리는 선언적 방식

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

// GeoJSON 외곽선 감김 방향이 시계방향이라 구면 투영(geoMercator)은
// 각 시군구를 "지구 전체에서 해당 구역만 뺀 영역"으로 잘못 해석한다.
// 좁은 수도권 범위에서는 왜곡이 무시할 수준이므로 평면 투영(geoIdentity)을 사용.
// 데이터에 잘못 들어간 원거리 좌표(일부 MultiPolygon)가 있어, 자동 bounds 대신
// 수도권 영역 사각형을 기준으로 화면을 맞춘다.
const FIT_BOUNDS = {
  type: 'Polygon',
  coordinates: [
    [
      [126.0, 36.8],
      [127.9, 36.8],
      [127.9, 38.35],
      [126.0, 38.35],
      [126.0, 36.8],
    ],
  ],
}
const projection = d3.geoIdentity().reflectY(true).fitSize([width, height], FIT_BOUNDS)
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
      fill: isRainy ? '#7cc4e8' : '#ffffff',
      stroke: isSelected ? '#0984e3' : '#adb5bd',
      strokeWidth: isSelected ? 2 : 0.6,
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
