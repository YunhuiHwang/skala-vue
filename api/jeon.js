// api/jeon.js (Weather Axios 실습 - 네이버 블로그 검색 프록시)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-28
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Axios)
// 변경사항 :
//   - 네이버 검색 API 는 CORS 를 허용하지 않아 브라우저에서 직접 호출 불가 → Vercel 서버리스 함수로 프록시
//   - [2026-08 이관] 기존 Naver Developers Center(openapi.naver.com, X-Naver-Client-* 헤더)가
//     NAVER API HUB(네이버 클라우드)로 통합됨. 엔드포인트와 인증 헤더를 HUB 방식으로 교체.
//       엔드포인트 : https://naverapihub.apigw.ntruss.com/search/v1/blog
//       인증 헤더  : X-NCP-APIGW-API-KEY-ID / X-NCP-APIGW-API-KEY
//   - 환경변수 이름은 기존(NAVER_CLIENT_ID / NAVER_CLIENT_SECRET) 그대로 두되,
//     값은 NAVER API HUB Application 의 Client ID / Client Secret 을 넣는다.
//   - 요청: GET /api/jeon?city=성남  →  "성남 모듬전 파전 맛집" 블로그 글 상위 3건 반환
//     ("전집" 만 넣으면 문학 "전집" 후기가, "전 맛집" 은 일반 맛집 글이 섞여 나와
//      "모듬전 파전 맛집" 으로 전(부침개) 파는 식당 후기에 최대한 맞춤)

const SEARCH_URL = 'https://naverapihub.apigw.ntruss.com/search/v1/blog'

export default async function handler(req, res) {
  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    res.status(500).json({ error: 'NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 가 설정되지 않았습니다.' })
    return
  }

  const city = String(req.query.city ?? '').trim()
  if (!city) {
    res.status(400).json({ error: 'city 파라미터가 필요합니다.' })
    return
  }
  const display = Math.min(Number(req.query.limit) || 3, 10)

  const url = new URL(SEARCH_URL)
  url.searchParams.set('query', `${city} 모듬전 파전 맛집`)
  url.searchParams.set('display', String(display))
  url.searchParams.set('sort', 'sim')

  try {
    const naverRes = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': clientId,
        'X-NCP-APIGW-API-KEY': clientSecret,
      },
    })
    if (!naverRes.ok) {
      const detail = await naverRes.text()
      res.status(naverRes.status).json({ error: `Naver API ${naverRes.status}`, detail })
      return
    }
    const data = await naverRes.json()
    const stripTags = (s) => String(s ?? '').replace(/<[^>]+>/g, '')
    // 응답 구조(items[].title/link/description/bloggername/postdate)는 이관 후에도 동일
    const posts = (data.items ?? []).map((item) => ({
      title: stripTags(item.title),
      link: item.link,
      description: stripTags(item.description),
      blogger: item.bloggername,
      postdate: item.postdate,
    }))
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
    res.status(200).json({ posts })
  } catch (err) {
    res.status(502).json({ error: '프록시 요청 실패', detail: String(err) })
  }
}
