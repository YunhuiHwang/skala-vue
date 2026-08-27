// kakaoLocalClient.js (Weather Axios 실습 - 기타 외부 API 확장)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Axios)
// 변경사항 :
//   - 대표 도시 이름 + "전" 키워드로 Kakao 로컬 API 를 검색해 상위 3곳의 링크를 반환
//   - 브라우저에서 바로 호출하려면 카카오 콘솔 > 앱 설정 > 플랫폼 > Web 에 도메인 등록 필요 (CORS)

import axios from 'axios'

const BASE_URL = 'https://dapi.kakao.com/v2/local/search/keyword.json'

export async function searchJeonRestaurants(cityName, limit = 3) {
  const restKey = import.meta.env.VITE_KAKAO_REST_KEY
  if (!restKey) {
    throw new Error('VITE_KAKAO_REST_KEY 가 설정되지 않았습니다. .env 파일을 확인하세요.')
  }

  const response = await axios.get(BASE_URL, {
    headers: {
      Authorization: `KakaoAK ${restKey}`,
    },
    params: {
      query: `${cityName} 전`,
      size: limit,
      sort: 'accuracy',
    },
  })

  return (response.data.documents ?? []).map((doc) => ({
    id: doc.id,
    name: doc.place_name,
    category: doc.category_name,
    address: doc.road_address_name || doc.address_name,
    url: doc.place_url,
  }))
}
