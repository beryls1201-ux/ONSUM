import { useEffect, useRef, useState } from 'react'

function canMove() {
  try {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover: hover)').matches
  } catch {
    return false
  }
}

// 마우스가 가까이 오면 안의 요소가 커서 쪽으로 살짝 끌려오는 효과 (React Bits 'Magnet' 방식)
// padding: 요소 바깥으로 반응하는 거리(px) · magnetStrength: 클수록 덜 움직임
// '움직임 줄이기' 설정이나 터치 화면에서는 움직이지 않음
export default function Magnet({
  children,
  padding = 100,
  magnetStrength = 2,
  disabled = false,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
}) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (disabled || !canMove()) return
    const onMove = (e) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      if (Math.abs(dx) < r.width / 2 + padding && Math.abs(dy) < r.height / 2 + padding) {
        setActive(true)
        setPos({ x: dx / magnetStrength, y: dy / magnetStrength })
      } else {
        setActive(false)
        setPos({ x: 0, y: 0 })
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [disabled, padding, magnetStrength])

  const off = disabled || !active

  return (
    <div ref={ref} className={wrapperClassName} style={{ position: wrapperClassName ? undefined : 'relative', display: wrapperClassName ? undefined : 'inline-block' }}>
      <div
        className={innerClassName}
        style={{
          transform: off ? 'translate3d(0, 0, 0)' : `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          transition: active ? activeTransition : inactiveTransition,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  )
}
