<script setup>
// UnitToggler.vue (Weather Store 실습 - 온도 단위 전환 버튼)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Pinia)
// 변경사항 :
//   - configStore 를 구독해 현재 온도 단위를 표시하고, 버튼으로 toggleUnit 을 호출
//   - App.vue 의 내비게이션 바 옆에 배치 (대시보드 상단 공용 영역)

import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span>
      온도 단위:
      <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong>
    </span>
    <button class="unit-btn" @click="configStore.toggleUnit">단위 변경</button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 14px;
  color: #495057;
}

.unit-btn {
  padding: 6px 10px;
  background-color: #4b6584;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
</style>
