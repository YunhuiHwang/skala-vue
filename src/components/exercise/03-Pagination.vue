<script setup>
// 03.Pagination (컴포넌트 분할 - 본인만의 추가 컴포넌트)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습
// 변경사항 :
//   - 카드가 한 화면에 길게 나열되는 문제를 해결하려고 직접 추가한 컴포넌트
//   - 페이지 이동 UI만 담당 (리스트 slice 는 부모 몫)
//   - currentPage / totalPages 를 props 로 받고 update:currentPage 를 emit

import { computed } from 'vue'

const props = defineProps({
  // 현재 페이지 번호 (1부터 시작, 부모 소유 상태)
  currentPage: {
    type: Number,
    required: true,
  },
  // 전체 페이지 수
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['update:currentPage'])

// 1 ~ totalPages 까지의 번호 배열 (페이지 번호 버튼용)
const pages = computed(() => Array.from({ length: props.totalPages }, (_, i) => i + 1))

const isFirst = computed(() => props.currentPage <= 1)
const isLast = computed(() => props.currentPage >= props.totalPages)

// 범위를 벗어나지 않을 때만 페이지 변경 emit
const goTo = (page) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('update:currentPage', page)
}
</script>

<template>
  <nav class="pagination">
    <button type="button" :disabled="isFirst" @click.stop="goTo(currentPage - 1)">이전</button>

    <button
      v-for="page in pages"
      :key="page"
      type="button"
      class="page-num"
      :class="{ active: page === currentPage }"
      @click.stop="goTo(page)"
    >
      {{ page }}
    </button>

    <button type="button" :disabled="isLast" @click.stop="goTo(currentPage + 1)">다음</button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
}

.pagination button {
  padding: 6px 10px;
  border: 1px solid #dee2e6;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  color: #adb5bd;
  cursor: not-allowed;
}

.pagination .page-num.active {
  background: #0984e3;
  border-color: #0984e3;
  color: #fff;
  font-weight: bold;
}
</style>
