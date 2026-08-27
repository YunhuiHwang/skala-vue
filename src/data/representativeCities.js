// representativeCities.js (Weather Axios 실습 - 수도권 실시간 지도용 대표 도시)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Axios)
// 변경사항 :
//   - 시군구 66개 전체를 개별 조회하는 대신 고르게 분산된 대표 도시 8곳만 조회
//   - 나머지 시군구는 가장 가까운 대표 도시의 날씨를 그대로 적용 (properties.repCity 로 매칭)
//   - repCity 매칭은 capital-region.geo.json 생성 시 centroid 최근접으로 미리 계산해 둠

export const representativeCities = [
  { id: 'seoul', name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 'incheon', name: '인천', lat: 37.4563, lon: 126.7052 },
  { id: 'suwon', name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 'seongnam', name: '성남', lat: 37.4201, lon: 127.1262 },
  { id: 'goyang', name: '고양', lat: 37.6584, lon: 126.832 },
  { id: 'yongin', name: '용인', lat: 37.2411, lon: 127.1776 },
  { id: 'bucheon', name: '부천', lat: 37.5034, lon: 126.766 },
  { id: 'uijeongbu', name: '의정부', lat: 37.7381, lon: 127.0337 },
]

export function findRepCity(id) {
  return representativeCities.find((city) => city.id === id) ?? null
}
