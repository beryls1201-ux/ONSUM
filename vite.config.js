import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages는 404.html을 모든 없는 주소에 보여줌 → index.html을 그대로 복사해 두면
// /ONSUM/cart 같은 주소에서 새로고침해도 사이트가 열림
function spaFallback() {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const dist = resolve(import.meta.dirname, 'dist')
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // 배포 주소가 https://beryls1201-ux.github.io/ONSUM/ 이므로 빌드할 때만 /ONSUM/ 아래에서 동작
  base: command === 'build' ? '/ONSUM/' : '/',
  plugins: [react(), spaFallback()],
}))
