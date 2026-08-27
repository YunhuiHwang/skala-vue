// owmClient.js (Weather Axios 실습 - OpenWeatherMap 통신)
// 작성목적 : 대표 도시 8곳의 실시간 날씨를 조회한다.
// 참고     : .env 의 VITE_OWM_API_KEY 가 없으면 키 미설정 에러를 던지므로,
//           호출하는 쪽(store)에서 반드시 try/catch 로 감싼다.

import axios from 'axios'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

// 1분에 60콜인 무료 플랜 한도를 여유있게 지키기 위해 요청을 CHUNK_SIZE 단위로 나눠서 호출
const CHUNK_SIZE = 5
const CHUNK_DELAY_MS = 600

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchOne(city) {
  const apiKey = import.meta.env.VITE_OWM_API_KEY
  if (!apiKey) {
    throw new Error('VITE_OWM_API_KEY 가 설정되지 않았습니다. .env 파일을 확인하세요.')
  }

  const response = await axios.get(BASE_URL, {
    params: {
      lat: city.lat,
      lon: city.lon,
      appid: apiKey,
      units: 'metric',
      lang: 'kr',
    },
  })

  const data = response.data
  const weatherMain = data.weather?.[0]?.main ?? 'Clear' // Rain, Clouds, Clear, Snow ...
  const description = data.weather?.[0]?.description ?? ''

  return {
    id: city.id,
    name: city.name,
    temp: Math.round(data.main.temp),
    min: Math.round(data.main.temp_min),
    max: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    wind: data.wind?.speed ?? 0,
    pressure: data.main.pressure,
    weatherMain,
    description,
    isRaining:
      weatherMain === 'Rain' || weatherMain === 'Drizzle' || weatherMain === 'Thunderstorm',
  }
}

// 대표 도시 목록을 CHUNK_SIZE 씩 나눠서 순차 호출 (분당 콜 수 제한 대응)
export async function fetchRepresentativeCitiesWeather(cities) {
  const results = []
  for (let i = 0; i < cities.length; i += CHUNK_SIZE) {
    const chunk = cities.slice(i, i + CHUNK_SIZE)
    const settled = await Promise.allSettled(chunk.map(fetchOne))
    settled.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        console.error(`[owmClient] ${chunk[idx].name} 날씨 조회 실패:`, result.reason?.message)
      }
    })
    if (i + CHUNK_SIZE < cities.length) {
      await sleep(CHUNK_DELAY_MS)
    }
  }
  return results
}
