// naverSearchClient.js (Weather Axios 실습 - 기타 외부 API 확장)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Axios)
// 변경사항 :
//   - 대표 도시 이름 + "전집" 키워드로 네이버 블로그 글 상위 3건을 검색
//   - 네이버 검색 API 는 CORS 를 허용하지 않아, 서버리스 함수(/api/jeon)를 통해 호출하고
//     실제 네이버 호출과 Client ID/Secret 보관은 서버가 담당

import axios from 'axios'

export async function searchJeonPosts(cityName, limit = 3) {
  try {
    const response = await axios.get('/api/jeon', {
      params: { city: cityName, limit },
    })
    return response.data.posts ?? []
  } catch (err) {
    // 프록시(api/jeon.js)가 내려준 실제 사유를 최대한 그대로 노출
    const data = err.response?.data
    let reason = data?.error || err.message
    if (data?.detail) reason = `${reason} - ${data.detail}`
    throw new Error(reason, { cause: err })
  }
}
