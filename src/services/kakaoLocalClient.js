// kakaoLocalClient.js (Weather Axios 실습 - [트러블슈팅 기록] 카카오 로컬 API 시도)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Axios)
// 변경사항 :
//   - "기타 외부 API" 로 카카오 로컬(장소 검색) API 를 먼저 시도한 기록 (현재 미사용)
//   - 1차: 브라우저에서 dapi.kakao.com 직접 호출 → CORS 및 REST 키 노출 문제
//   - 2차: 서버리스 함수로 프록시 → 403 NotAuthorizedError
//          "App(...) disabled OPEN_MAP_AND_LOCAL service"
//          (카카오맵 API 유료 전환으로, 결제수단 등록 전에는 활성화 토글이 잠김)
//   - 결론: 네이버 블로그 검색(naverSearchClient.js)으로 대체
//   - 이 파일은 트러블슈팅 서술용 참고 코드이며 어디에서도 import 하지 않는다.

import axios from 'axios'

// [2차 시도] 프록시(/api/jeon)를 거쳐 카카오 로컬 API 호출
export async function searchJeonRestaurants(cityName, limit = 3) {
  try {
    const response = await axios.get('/api/jeon', {
      params: { city: cityName, limit },
    })
    return response.data.restaurants ?? []
  } catch (err) {
    const data = err.response?.data
    let reason = data?.error || err.message
    if (data?.detail) reason = `${reason} - ${data.detail}`
    throw new Error(reason, { cause: err })
  }
}

/*
// [1차 시도] 브라우저에서 카카오 REST API 직접 호출 (CORS / 키 노출 문제로 폐기)
export async function searchJeonRestaurantsDirect(cityName, limit = 3) {
  const restKey = import.meta.env.VITE_KAKAO_REST_KEY
  if (!restKey) throw new Error('VITE_KAKAO_REST_KEY 가 설정되지 않았습니다.')

  const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
    headers: { Authorization: `KakaoAK ${restKey}` },
    params: { query: `${cityName} 전`, size: limit, sort: 'accuracy' },
  })
  return (response.data.documents ?? []).map((doc) => ({
    id: doc.id,
    name: doc.place_name,
    category: doc.category_name,
    address: doc.road_address_name || doc.address_name,
    url: doc.place_url,
  }))
}

// [2차 시도] 서버리스 함수 api/jeon.js 의 카카오 버전 (403 으로 폐기)
export default async function handler(req, res) {
  const key = process.env.KAKAO_REST_KEY
  if (!key) {
    res.status(500).json({ error: 'KAKAO_REST_KEY 가 설정되지 않았습니다.' })
    return
  }
  const city = String(req.query.city ?? '').trim()
  if (!city) {
    res.status(400).json({ error: 'city 파라미터가 필요합니다.' })
    return
  }
  const limit = Math.min(Number(req.query.limit) || 3, 15)

  const url = new URL('https://dapi.kakao.com/v2/local/search/keyword.json')
  url.searchParams.set('query', `${city} 전`)
  url.searchParams.set('size', String(limit))
  url.searchParams.set('sort', 'accuracy')

  const kakaoRes = await fetch(url, { headers: { Authorization: `KakaoAK ${key}` } })
  if (!kakaoRes.ok) {
    const detail = await kakaoRes.text()
    res.status(kakaoRes.status).json({ error: `Kakao API ${kakaoRes.status}`, detail })
    return
  }
  const data = await kakaoRes.json()
  const restaurants = (data.documents ?? []).map((doc) => ({
    id: doc.id,
    name: doc.place_name,
    category: doc.category_name,
    address: doc.road_address_name || doc.address_name,
    url: doc.place_url,
  }))
  res.status(200).json({ restaurants })
}
*/
