import { useRef, useState } from 'react'

function canMove() {
  try {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover: hover)').matches
  } catch {
    return false
  }
}

// 마우스 위치에 따라 카드가 은은하게 기울어짐 (반짝이·색 막 없음)
// max: 최대 기울기(도) · lift: 마우스를 올렸을 때 함께 떠오르는 높이(px)
// as: 안쪽 요소 태그 · '움직임 줄이기' 설정이나 터치 화면에서는 기울지 않음
export default function Tilt({ children, max = 6, lift = 0, as: Tag = 'div', className = '', style, ...rest }) {
  const ref = useRef(null)
  const [rot, setRot] = useState({ x: 0, y: 0, on: false })

  const onMove = (e) => {
    if (!canMove() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5 // -0.5 ~ 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setRot({ x: -py * 2 * max, y: px * 2 * max, on: true })
  }

  const onLeave = () => setRot({ x: 0, y: 0, on: false })

  return (
    <div style={{ perspective: 900, display: 'flex', flexDirection: 'column' }}>
      <Tag
        {...rest}
        ref={ref}
        className={className}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          ...style,
          flex: '1 1 auto',
          transform: `translateY(${rot.on ? -lift : 0}px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transition: rot.on ? 'transform 0.15s ease-out, box-shadow 0.35s ease' : 'transform 0.5s ease, box-shadow 0.35s ease',
          willChange: 'transform',
        }}
      >
        {children}
      </Tag>
    </div>
  )
}
