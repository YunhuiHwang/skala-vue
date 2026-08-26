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

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 본인만의 반응형 상태: 정렬 기준 (이름순 / 온도순)
const sortOrder = ref('name')

// 검색어로 필터링된 날씨 리스트 (검색어가 비어있으면 원본 그대로 반환)
const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(keyword))
})

// 본인만의 Computed: 필터링된 리스트를 정렬 기준에 따라 재정렬
const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value]
  if (sortOrder.value === 'temp') {
    return list.sort((a, b) => b.temp - a.temp)
  }
  return list.sort((a, b) => a.name.localeCompare(b.name))
})

// selectedCityInfo 감시 (watch): 상태바 문구가 바뀔 때마다 로그
watch(selectedCityInfo, (newValue, oldValue) => {
  console.log(`[watch] selectedCityInfo 변경: "${oldValue}" -> "${newValue}"`)
})

// searchQuery 감시 (watchEffect): 타이핑할 때마다 변하는 검색어 추적
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

// 본인만의 Watcher: 정렬 기준이 바뀔 때마다 로그
watch(sortOrder, (newValue) => {
  console.log(`[watch] 정렬 기준 변경: ${newValue === 'temp' ? '온도순' : '이름순'}`)
})

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="dashboard-wrapper">
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

      <!-- 본인만의 상태 컨트롤: 정렬 기준 토글 -->
      <button class="btn-sort" @click="sortOrder = sortOrder === 'name' ? 'temp' : 'name'">
        정렬 기준: {{ sortOrder === 'temp' ? '온도순' : '이름순' }} (클릭해서 전환)
      </button>
    </section>

    <section class="list-box">
      <h3>지역별 날씨 현황</h3>

      <!-- 검색 결과가 없을 때 안내 문구 -->
      <p v-if="sortedWeatherList.length === 0" class="no-result">
        검색 결과와 일치하는 도시가 없습니다.
      </p>

      <!-- 검색어가 비었거나 일치하는 데이터가 있을 때 목록 출력 -->
      <div
        v-for="item in sortedWeatherList"
        :key="item.id"
        class="weather-card"
        @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>
        <p>최저 기온: {{ item.min }}°C/최고 기온: {{ item.max }}°C</p>

        <span v-if="item.temp >= 25" class="badge hot">더움 (25도 이상)</span>
        <span v-else class="badge cool">선선함 (25도 미만)</span>

        <!-- 버블링 없이 alert 창 띄우기 위해 .stop 수식어 사용 -->
        <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
          상세보기
        </button>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
