// api/jeon.js (Weather Axios 실습 - 네이버 블로그 검색 프록시)
// 작성자 : P068 황윤희
// 작성일 : 2026-08-27
// 작성목적 : SKALA 4기 Frontend Framework(Vue.js) Hands on 실습 (Axios)
// 변경사항 :
//   - 네이버 검색 API 는 CORS 를 허용하지 않아 브라우저에서 직접 호출 불가 → Vercel 서버리스 함수로 프록시
//   - NAVER_CLIENT_ID / NAVER_CLIENT_SECRET(VITE_ 접두사 없는 서버 전용 환경변수) 사용
//   - 요청: GET /api/jeon?city=성남  →  "성남 전집" 블로그 글 상위 3건 반환

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

  const url = new URL('https://openapi.naver.com/v1/search/blog.json')
  url.searchParams.set('query', `${city} 전집`)
  url.searchParams.set('display', String(display))
  url.searchParams.set('sort', 'sim')

  try {
    const naverRes = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    })
    if (!naverRes.ok) {
      const detail = await naverRes.text()
      res.status(naverRes.status).json({ error: `Naver API ${naverRes.status}`, detail })
      return
    }
    const data = await naverRes.json()
    const stripTags = (s) => String(s ?? '').replace(/<[^>]+>/g, '')
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
