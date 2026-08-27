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

날씨 카드 누르면 상태바에 도시명 뜨는 기능이 있는데, 검색창이나 빈 공간처럼 카드 아닌 곳을 누르면 다시 초기 문구로 돌아가는 기능을 추가했다.

제일 바깥 'dashboard-wrapper'에 클릭 이벤트를 걸고, 카드 클릭에는 '.stop'이 없으면 바로 초기화 문구로 덮어써버려서 '.stop'을 붙였다.

# 2. Composition

## 1.1 데이터

WetherComposition.vue 만들 때

[vue/compiler-sfc] Legacy octal literals are not allowed in strict mode. (2:7)

<script setup>
import 01-WeatherMockup from './components/exercise/01-WeatherMockup.vue'
</script>

<template><01-WeatherMockup /></template>

<script setup>
import WeatherMockup from './components/exercise/01-WeatherMockup.vue'
</script>

<template><WeatherMockup /></template>

--> 정리하면 import 할 때는 숫자/문자로 시작 못 한다는 걸 몰라서 안 됐고, 수정했는데도 안 돼서 보니까 App.vue만 바꾸고 HomeView.vue는 안 바꿔서 그런 거였다. 둘 다 변경하니 수정 됨.
