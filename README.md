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
