<script setup>
// WeatherCard.vue (컴포넌트 분할 - 날씨 카드 자식)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습
// 변경사항 :
//   - 반복되던 날씨 카드 1개를 자식 컴포넌트로 분리
//   - item prop 으로 도시 1건을 받아 표시, select / detail 을 emit
//   - 버블링 방지를 위해 클릭 핸들러에 @click.stop 유지

defineProps({
  // 날씨 도시 1건 { id, name, temp, min, max, status }
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select', 'detail'])
</script>

<template>
  <div class="weather-card" @click.stop="emit('select', item.name)">
    <h4>{{ item.name }} ({{ item.status }})</h4>
    <p>현재 기온: {{ item.temp }}°C</p>
    <p>최저 기온: {{ item.min }}°C/최고 기온: {{ item.max }}°C</p>

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
