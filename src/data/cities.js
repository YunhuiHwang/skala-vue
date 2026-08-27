// cities.js (Weather Router 실습용 공용 Mock Data)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Vue Router)
// 변경사항 :
//   - WeatherParent 에 인라인으로 있던 도시 배열을 View 여러 곳에서 공유하기 위해 모듈로 분리
//   - WeatherDetailView 의 상세 화면을 위해 관측 항목(습도/풍속/강수확률/기압) 추가
//   - 03 파일은 자체 인라인 데이터를 그대로 두고, 이 모듈은 04(Router) 이후 View 에서만 사용

// 도시별 날씨 Mock Data
export const cities = [
  {
    id: 'city_01',
    name: '서울',
    temp: 30,
    min: 24,
    max: 31,
    status: '맑음',
    humidity: 55,
    wind: 2.1,
    rainProb: 10,
    pressure: 1012,
  },
  {
    id: 'city_02',
    name: '수원',
    temp: 24,
    min: 20,
    max: 28,
    status: '맑음',
    humidity: 60,
    wind: 1.8,
    rainProb: 15,
    pressure: 1011,
  },
  {
    id: 'city_03',
    name: '부산',
    temp: 32,
    min: 28,
    max: 35,
    status: '구름많음',
    humidity: 70,
    wind: 3.4,
    rainProb: 30,
    pressure: 1009,
  },
  {
    id: 'city_04',
    name: '제주',
    temp: 22,
    min: 18,
    max: 25,
    status: '흐림',
    humidity: 78,
    wind: 4.2,
    rainProb: 45,
    pressure: 1008,
  },
  {
    id: 'city_05',
    name: '대전',
    temp: 30,
    min: 26,
    max: 33,
    status: '맑음',
    humidity: 52,
    wind: 1.5,
    rainProb: 5,
    pressure: 1013,
  },
  {
    id: 'city_06',
    name: '광주',
    temp: 27,
    min: 23,
    max: 30,
    status: '비',
    humidity: 85,
    wind: 2.7,
    rainProb: 80,
    pressure: 1006,
  },
  {
    id: 'city_07',
    name: '대구',
    temp: 35,
    min: 30,
    max: 40,
    status: '맑음',
    humidity: 40,
    wind: 1.2,
    rainProb: 0,
    pressure: 1014,
  },
  {
    id: 'city_08',
    name: '강릉',
    temp: 23,
    min: 19,
    max: 27,
    status: '구름많음',
    humidity: 65,
    wind: 3.9,
    rainProb: 25,
    pressure: 1010,
  },
  {
    id: 'city_09',
    name: '인천',
    temp: 21,
    min: 17,
    max: 25,
    status: '흐림',
    humidity: 72,
    wind: 4.6,
    rainProb: 40,
    pressure: 1009,
  },
  {
    id: 'city_10',
    name: '울산',
    temp: 33,
    min: 29,
    max: 37,
    status: '맑음',
    humidity: 48,
    wind: 2.0,
    rainProb: 5,
    pressure: 1013,
  },
]

// 동적 경로 파라미터(cityId)로 도시 1건을 조회 (없으면 null)
export function findCity(cityId) {
  return cities.find((city) => city.id === cityId) ?? null
}

// 도시 이름으로 cityId 를 조회 (자식 컴포넌트가 name 만 넘겨줄 때 사용)
export function findCityIdByName(name) {
  return cities.find((city) => city.name === name)?.id ?? null
}
