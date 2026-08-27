import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// 개발 서버(npm run dev)에서도 /api/jeon 이 동작하도록 서버리스 핸들러를 미들웨어로 연결.
// (Vercel 배포 시에는 api/ 폴더가 자동으로 서버리스 함수로 동작하므로 이 미들웨어는 dev 전용)
function devApiPlugin(env) {
  return {
    name: 'dev-api-jeon',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const u = new URL(req.url, 'http://localhost')
        if (u.pathname !== '/api/jeon') return next()
        try {
          // Vercel 스타일 req/res 로 맞춰줌
          req.query = Object.fromEntries(u.searchParams)
          res.status = (code) => ((res.statusCode = code), res)
          res.json = (obj) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify(obj))
          }
          // .env 의 서버 전용 키를 핸들러가 읽을 수 있도록 process.env 로 넘겨줌
          for (const k of ['NAVER_CLIENT_ID', 'NAVER_CLIENT_SECRET']) {
            if (!process.env[k] && env[k]) process.env[k] = env[k]
          }
          const { default: handler } = await import('./api/jeon.js')
          await handler(req, res)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: 'dev proxy 실패', detail: String(err) }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // '' prefix → VITE_ 뿐 아니라 KAKAO_REST_KEY 같은 변수도 읽어옴
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue(), vueDevTools(), devApiPlugin(env)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
