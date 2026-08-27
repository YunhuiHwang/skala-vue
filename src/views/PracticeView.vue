<script setup>
// PracticeView.vue (이전 단계 - 단계별 쇼케이스)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습
// 변경사항 :
//   - 좌측 사이드바 버튼 1~5, 우측 패널에 해당 단계 화면을 라이브로 렌더
//   - 1~3단계는 독립 컴포넌트, 4단계는 통계 view(라우팅 결과물), 5단계는 store 반영 메인 대시보드
//   - 4·5단계는 라우터 앱이라 패널 안에서 카드/링크 클릭 시 실제 앱으로 이동함 (캡션에 안내)

import { ref } from 'vue'
import WeatherMockup from '../components/exercise/WeatherMockup.vue'
import WeatherComposition from '../components/exercise/WeatherComposition.vue'
import WeatherParent from '../components/exercise/WeatherParent.vue'
import WeatherStatsView from './WeatherStatsView.vue'
import WeatherHomeView from './WeatherHomeView.vue'

const stages = [
  {
    n: 1,
    title: 'Mockup',
    desc: 'v-if / v-for / 이벤트로 만든 정적 목업. 도시 10개, status·min 기준 뱃지, 카드 밖 클릭 시 상태바 초기화.',
    component: WeatherMockup,
  },
  {
    n: 2,
    title: 'Composition',
    desc: 'computed 검색 필터, watch / watchEffect 상태 감시, 이름·온도 정렬 토글(본인 추가).',
    component: WeatherComposition,
  },
  {
    n: 3,
    title: 'Components',
    desc: '한 파일을 부모 1 + 자식 4로 분리(props / emits / slot). BaseDashboardCard 슬롯, WeatherPagination(본인 추가).',
    component: WeatherParent,
  },
  {
    n: 4,
    title: 'Router',
    desc: 'Vue Router 도입 — 라우트 정의 / 지연 로딩 / Catch-all. 아래는 본인 추가 view 인 통계 페이지.',
    component: WeatherStatsView,
  },
  {
    n: 5,
    title: 'Store',
    desc: 'Pinia — configStore(섭씨·화씨 전환), recentStore(최근 본 도시). 아래는 store 가 반영된 메인 대시보드.',
    component: WeatherHomeView,
  },
]

const selected = ref(0)
</script>

<template>
  <div class="practice-body">
    <aside class="stage-nav">
      <button
        v-for="(s, i) in stages"
        :key="s.n"
        class="stage-btn"
        :class="{ active: selected === i }"
        @click="selected = i"
      >
        <span class="stage-num">{{ s.n }}</span>
        <span class="stage-title">{{ s.title }}</span>
      </button>
    </aside>

    <section class="stage-panel">
      <div class="stage-caption">
        <h2>{{ stages[selected].n }}. {{ stages[selected].title }}</h2>
        <p>{{ stages[selected].desc }}</p>
        <p v-if="stages[selected].n >= 4" class="note">
          ※ 라우터 앱이라 패널 안에서 카드·링크를 클릭하면 실제 앱으로 이동합니다.
        </p>
      </div>

      <div class="stage-render">
        <component :is="stages[selected].component" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.practice-body {
  display: flex;
  gap: 24px;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 24px;
  align-items: flex-start;
}

.stage-nav {
  flex: 0 0 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: sticky;
  top: 24px;
}

.stage-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.stage-btn.active {
  border-color: #0984e3;
  background: #0984e3;
  color: #fff;
}

.stage-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e9ecef;
  color: #495057;
  font-weight: bold;
  font-size: 13px;
}

.stage-btn.active .stage-num {
  background: #fff;
  color: #0984e3;
}

.stage-title {
  font-weight: bold;
}

.stage-panel {
  flex: 1;
  min-width: 0;
}

.stage-caption {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.stage-caption h2 {
  font-size: 18px;
  margin-bottom: 6px;
}

.stage-caption p {
  color: #495057;
  line-height: 1.6;
  font-size: 14px;
}

.stage-caption .note {
  margin-top: 6px;
  color: #e67700;
  font-size: 13px;
}

.stage-render {
  border: 1px dashed #ced4da;
  border-radius: 8px;
  padding: 20px 0;
  overflow-x: auto;
}
</style>
