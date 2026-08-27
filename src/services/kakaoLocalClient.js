// kakaoLocalClient.js (Weather Axios 실습 - 기타 외부 API 확장)
// 작성목적 : 대표 도시 이름 + "전" 키워드로 장소를 검색해 상위 3곳의 링크를 보여준다.
// 참고     : 카카오 디벨로퍼스 콘솔 > 내 애플리케이션 > 플랫폼 > Web 에
//           개발 중인 도메인(예: http://localhost:5173)을 등록해야 브라우저에서
//           바로 호출했을 때 CORS 에러 없이 응답을 받을 수 있다.

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
