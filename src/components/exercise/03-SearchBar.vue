<script setup>
// 03.Search Bar (컴포넌트 분할 - 검색/정렬 입력 자식)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습
// 변경사항 :
//   - 검색 영역(입력창 + 정렬 토글)을 자식 컴포넌트로 분리
//   - searchQuery / sortOrder 를 props 로 받고 update:searchQuery / toggle-sort 를 emit

import BaseDashboardCard from './03-BaseDashboardCard.vue'

defineProps({
  // 현재 검색어 (부모 소유 상태)
  searchQuery: {
    type: String,
    required: true,
  },
  // 현재 정렬 기준: 'name' | 'temp'
  sortOrder: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:searchQuery', 'toggle-sort'])

// input 이벤트를 부모로 그대로 올려보냄 (v-model 대신 :value + @input 실습)
const onInput = (e) => {
  emit('update:searchQuery', e.target.value)
}
</script>

<template>
  <BaseDashboardCard title="도시 검색">
    <input type="text" :value="searchQuery" @input="onInput" placeholder="검색할 도시 이름 입력" />
    <p>
      검색 중인 도시: <strong>{{ searchQuery }}</strong>
    </p>

    <!-- 정렬 기준 토글: 실제 상태 변경은 부모가 처리 -->
    <button class="btn-sort" @click="emit('toggle-sort')">
      정렬 기준: {{ sortOrder === 'temp' ? '온도순' : '이름순' }} (클릭해서 전환)
    </button>
  </BaseDashboardCard>
</template>
