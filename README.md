# 1. Mockup

## 1.1 데이터

기존 3개 도시(서울/수원/부산)를 10개(제주/대전/광주/대구/강릉/인천/울산 추가)로 늘렸다. 각 도시에 최저기온(min), 최고기온(max) 필드도 추가했고, 날씨 상태(status)도 맑음/비 2종류에서 날씨앱을 참고해 4종류로 늘렸다.

## 1.2 v-if 조건 변경

온도 25도 기준으로 더움/선선함 구분하던 조건을 status와 min(최저기온)을 보는 조건들로 변경했다.

```vue
<span v-if="item.status === '비'" class="badge rain">☔ 우산 챙기세요</span>
<span v-else-if="item.min >= 25" class="badge tropical">🌙 열대야 조심</span>
<span v-else-if="item.status === '맑음'" class="badge sunny">☀️ 맑음</span>
```

## 1.3 카드 밖 클릭하면 초기화

날씨 카드 누르면 상태바에 도시명 뜨는 기능이 있는데, 검색창이나 빈 공간처럼 카드 아닌 곳을 누르면 다시 초기 문구로 돌아가는 기능을 추가했다. 제일 바깥 'dashboard-wrapper'에 클릭 이벤트를 걸고, 카드 클릭에는 '.stop'이 없으면 바로 초기화 문구로 덮어써버려서 '.stop'을 붙였다.

## 1.4 트러블슈팅: 파일명 변경 후 import 깨짐

파일명을 실습 순서를 붙여 '01-WeatherMockup.vue'로 바꾸려 했는데, VS Code가 자동으로 import 경로도 고쳐주며 'WeatherMockup.vue/index.js'라는 잘못된 경로로 바꿔줬다. 게다가 이 깨진 import가 'App.vue'가 아니라 'HomeView.vue'에 있어서 한참 헤매다, 에러 메시지에 찍힌 파일 경로를 찾아서 수정치니 정상 작동했다.

# 2. Composition

## 2.1 검색 필터링 (computed)

타이핑할 때마다 직접 리스트를 걸러내는 대신, computed로 검색어에 맞는 도시만 자동으로 다시 계산되도록 작성했다. 검색 결과가 하나도 없으면 안내 문구를 따로 띄운다.

```vue
const filteredWeatherList = computed(() => { const query = searchQuery.value.trim() if (!query)
return weatherList.value return weatherList.value.filter((item) => item.name.includes(query)) })
```

## 2.2 상태 감시 (watch, watchEffect)

selectedCityInfo(상태바 문구)는 watch로, searchQuery(검색어)는 watchEffect로 감시해서 값이 바뀔 때마다 콘솔에 로그를 남기게 했다.

## 2.3 정렬 기능 (본인 추가 기능)

이름순/온도순으로 바꿀 수 있는 정렬 토글 버튼을 추가했다. sortOrder 상태를 두고, 검색으로 걸러진 리스트를 정렬 기준에 맞게 다시 정렬해서 화면에 보여준다.

```vue
const sortedWeatherList = computed(() => { const list = [...filteredWeatherList.value] return
sortOrder.value === 'temp' ? list.sort((a, b) => b.temp - a.temp) : list.sort((a, b) =>
a.name.localeCompare(b.name)) })
```

# 3. Components

## 3.1 파일 분할 구조

한 파일에 있던 마크업을 부모 1개와 자식 4개로 분리했다. 데이터와 상태('weatherList', 'searchQuery', 'selectedCityInfo', 'sortOrder', 'currentPage')는 부모가 소유하고, 자식은 props로 값을 전달받아 표시하며 사용자 동작은 emit으로 부모에 전달한다(props down / events up).

- '03-WetherParent.vue' : 데이터/상태/computed/watch를 소유하는 부모 컨테이너
- '03-SearchBar.vue' : 검색어 입력과 정렬 토글 담당. 'searchQuery', 'sortOrder'를 받아 'update:searchQuery', 'toggle-sort'를 emit
- '03-WeatherCard.vue' : 날씨 카드 1건 표시. 'item'을 받아 뱃지 조건을 처리하고 'select', 'detail'을 emit
- '03-BaseDashboardCard.vue' : 카드형 레이아웃 공용 컴포넌트
- '03-Pagination.vue' : 본인 추가 컴포넌트 (아래 3.2)

## 3.2 페이지네이션 (본인 추가 컴포넌트)

도시가 10개로 늘어나면서 카드가 한 화면에 모두 나열되어 가독성이 떨어지고 심미성이 떨어졌다. 이를 개선하기 위해 한 페이지에 4개('pageSize')씩만 표시하고 페이지를 넘겨볼 수 있는 'Pagination' 컴포넌트를 추가했다.

리스트를 자르는 계산은 부모가 담당하고, 이 컴포넌트는 이전/다음/페이지 번호 버튼 UI만 담당한다. 'currentPage', 'totalPages'를 props로 받고, 페이지 이동은 'update:currentPage'로 emit한다.

검색어나 정렬 기준이 바뀌면 결과 수가 줄어 빈 페이지가 표시될 수 있어, watch로 'currentPage'를 1로 초기화하도록 처리했다.

# 4. Router

## 4.1 상세 페이지 갱신 처리

'/weather/:cityId'에서 도시만 바뀔 때는 같은 컴포넌트가 재사용되어 'onMounted'가 다시 호출되지 않는다는 걸 확인했다. 그래서 'route.params.cityId'를 watch해서 도시가 바뀔 때마다 데이터를 다시 찾아오도록 처리했다.

## 4.2 공용 Mock Data ('src/data/04-cities.js')

홈 화면과 상세 화면이 같은 도시 데이터를 써야 해서 인라인 배열을 모듈로 분리하고, 상세 화면에 필요한 습도/풍속/강수확률/기압 항목을 추가했다.

## 4.3 04-WeatherStatsView.vue (본인 추가 view)

공용 Mock Data를 computed로 집계해서 전체 도시 수, 평균 기온, 최고/최저 기온 도시, 날씨 상태(맑음/비/구름많음/흐림)별 도시 수 분포를 보여준다.

최고 기온 도시와 최저 기온 도시는 이름을 클릭하면 해당 도시의 상세 페이지로 바로 이동하도록 만들어서, 단순히 숫자만 나열하는 통계 화면이 아니라 다른 화면과 연결되게 했다.

# 5. Store

## 5.0 파일명 리팩토링

실습 과정을 진행하면서 편의상 파일명에 실습 순서를 붙인 '01-' ~ '04-' 프리픽스가 존재했다. 그런데 파일 수정 시 버전 관리가 어렵고 import 등에 불편함이 생겨 이번 실습 진행 전 제거하는 방향으로 리팩토링했다.

## 5.1 온도 단위 전환 (configStore)

'unit'(섭씨/화씨) state, 'unitSymbol' getter, 'toggleUnit' action을 두고 네비게이션 바 옆 'UnitToggler'로 전환한다. 목록과 상세는 'formatTemp()'로 단위에 맞춰 기온을 변환해 보여주고, 뱃지 조건은 섭씨 기준을 유지했다.

## 5.2 최근 본 도시 (본인 추가 recentStore)

상세 페이지에 들어갈 때마다 조회한 도시를 'recentStore'에 쌓아, 홈 상단에 '최근 본 도시' 섹션으로 보여준다. 상태 'recentCityIds'에 도시 id를 최신순으로 담고, action 'addRecentView'는 중복 id를 맨 앞으로 당기며 최대 5개까지만 유지하도록 구현했다.

'WeatherDetailView'의 'loadCity()'에서 'addRecentView'를 호출하고, 홈에서는 도시명을 누르면 'RouterLink'로 해당 상세 페이지로 이동한다.
