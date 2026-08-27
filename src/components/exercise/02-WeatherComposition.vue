<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 날씨 데이터 (최저기온/최고기온 추가 및 데이터 추가)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 30, min: 24, max: 31, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, min: 20, max: 28, status: '맑음' },
  { id: 'city_03', name: '부산', temp: 32, min: 28, max: 35, status: '구름많음' },
  { id: 'city_04', name: '제주', temp: 22, min: 18, max: 25, status: '흐림' },
  { id: 'city_05', name: '대전', temp: 30, min: 26, max: 33, status: '맑음' },
  { id: 'city_06', name: '광주', temp: 27, min: 23, max: 30, status: '비' },
  { id: 'city_07', name: '대구', temp: 35, min: 30, max: 40, status: '맑음' },
  { id: 'city_08', name: '강릉', temp: 23, min: 19, max: 27, status: '구름많음' },
  { id: 'city_09', name: '인천', temp: 21, min: 17, max: 25, status: '흐림' },
  { id: 'city_10', name: '울산', temp: 33, min: 29, max: 37, status: '맑음' },
])

// 검색어 및 알림창 제어
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 본인만의 반응형 상태 변수: 카드를 몇 번 클릭했는지 카운트
const viewCount = ref(0)

// computed: 검색어에 맞게 필터링된 리스트
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) {
    return weatherList.value
  }
  return weatherList.value.filter((item) => item.name.includes(query))
})

// 본인만의 computed: 열대야 조심 뱃지가 뜨는 도시 개수 (비 오는 곳 제외, 최저기온 25도 이상)
const tropicalNightCount = computed(
  () => weatherList.value.filter((item) => item.status !== '비' && item.min >= 25).length,
)

// watch: 상태바 문구가 바뀔 때마다 콘솔로그
watch(selectedCityInfo, (newInfo) => {
  console.log(`[watch] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// watchEffect: 검색어가 바뀔 때마다 자동으로 추적
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어 '${searchQuery.value}'로 필터링 중`)
})

// 본인만의 watch: 카드 클릭 횟수를 감시
watch(viewCount, (newCount) => {
  console.log(`[watch] 지금까지 카드를 총 ${newCount}번 클릭했습니다.`)
})

// 알림 대행 함수
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 카드 클릭 시 상태바 갱신 + 클릭 횟수 증가
const selectCity = (name) => {
  selectedCityInfo.value = `${name}이 선택되었습니다.`
  viewCount.value++
}
</script>

<template>
  <div class="dashboard-wrapper" @click="selectedCityInfo = '카드를 클릭하거나 검색해 보세요.'">
    <section class="search-box">
      <h3>도시 검색</h3>
      <!-- v-model 대신 :value와 @input 사용 -->
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>지역별 날씨 현황</h3>
      <p class="summary">
        🌙 열대야 주의 도시: {{ tropicalNightCount }}곳 / 카드 클릭 횟수: {{ viewCount }}회
      </p>

      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        @click.stop="selectCity(item.name)"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>
        <p>최저 기온: {{ item.min }}°C/최고 기온: {{ item.max }}°C</p>

        <!-- 본인만의 조건으로 변경한 v-if 사용 -->
        <span v-if="item.status === '비'" class="badge rain">☔ 우산 챙기세요</span>
        <span v-else-if="item.min >= 25" class="badge tropical">🌙 열대야 조심</span>
        <span v-else-if="item.status === '맑음'" class="badge sunny">☀️ 맑음</span>

        <!-- 버블링 없이 alert 창 띄우기 위해 .stop 수식어 사용 -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>

      <p v-if="filteredWeatherList.length === 0" class="no-result">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
