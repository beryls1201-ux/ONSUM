// src/assets 아래 이미지를 파일 이름 속 ID(IMG-…)로 찾는다
const files = import.meta.glob('../assets/page*/*.jpg', { eager: true, import: 'default' })

const byId = {}
for (const [path, url] of Object.entries(files)) {
  const m = path.match(/IMG-[A-Z0-9]+-\d+(?:-\d+)?/)
  if (m) byId[m[0]] = url
}

export function img(id) {
  return byId[id] || null
}

export { default as logo } from '../assets/logo/onsum-logo-primary.svg'
