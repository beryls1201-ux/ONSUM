import { useRef, useState } from 'react'

function canMove() {
  try {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover: hover)').matches
  } catch {
    return false
  }
}

// 마우스를 따라 상자 안이 은은하게 밝아지는 빛 (React Bits 'SpotlightCard' 방식, 테두리 빛·반짝이 없음)
// color: 빛 색 · intensity: 빛 세기(0~1) · size: 빛 지름(px)
// '움직임 줄이기' 설정이나 터치 화면에서는 보이지 않음
export default function Spotlight({ children, as: Tag = 'div', color = '#FFF6E4', intensity = 0.1, size = 240, className = '', style }) {
  const ref = useRef(null)
  const [spot, setSpot] = useState({ x: 0, y: 0, on: false })

  const onMove = (e) => {
    if (!canMove() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, on: true })
  }

  return (
    <Tag ref={ref} className={`spotlight ${className}`} style={style} onMouseMove={onMove} onMouseLeave={() => setSpot((s) => ({ ...s, on: false }))}>
      <span
        aria-hidden="true"
        className="spotlight-glow"
        style={{
          opacity: spot.on ? 1 : 0,
          background: `radial-gradient(${size / 2}px circle at ${spot.x}px ${spot.y}px, ${hexToRgba(color, intensity * 4)}, ${hexToRgba(color, 0)} 70%)`,
        }}
      />
      {children}
    </Tag>
  )
}

function hexToRgba(hex, a) {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, (c) => c + c) : h, 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${Math.min(1, a)})`
}
