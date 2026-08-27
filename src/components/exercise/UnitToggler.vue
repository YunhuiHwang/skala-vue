<script setup>
// UnitToggler.vue (Weather Store 실습 - 온도 단위 전환 버튼)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Pinia)
// 변경사항 :
//   - configStore 를 구독해 현재 온도 단위를 표시하고, 버튼으로 toggleUnit 을 호출
//   - App.vue 의 내비게이션 바 옆에 배치 (대시보드 상단 공용 영역)
//   - [UI Library] 직접 만든 button 을 Element Plus 의 el-switch 로 교체
//     스토어 state 는 'celsius' | 'fahrenheit' 문자열이라 el-switch 의 v-model 과 타입이 맞지 않아,
//     get/set 을 가진 computed 로 감싸서 스위치 조작이 toggleUnit 액션을 호출하도록 연결

import { computed } from 'vue'
import { ElSwitch } from 'element-plus'
import 'element-plus/theme-chalk/el-switch.css'
import { useConfigStore } from '../../stores/configStore.js'

const configStore = useConfigStore()

// el-switch 는 boolean(또는 지정한 두 값)만 다루므로 스토어 문자열 state 와 이어주는 어댑터
const isFahrenheit = computed({
  get: () => configStore.unit === 'fahrenheit',
  set: (checked) => {
    if (checked !== (configStore.unit === 'fahrenheit')) configStore.toggleUnit()
  },
})
</script>

<template>
  <div class="unit-toggler">
    <span>온도 단위</span>
    <ElSwitch
      v-model="isFahrenheit"
      inline-prompt
      active-text="℉"
      inactive-text="℃"
      style="--el-switch-on-color: #4b6584; --el-switch-off-color: #0984e3"
    />
    <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong>
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
</style>
