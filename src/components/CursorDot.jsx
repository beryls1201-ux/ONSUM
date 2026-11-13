import { useEffect, useRef } from 'react'

const CLICKABLE = 'a, button, select, label, summary, [role="tab"], input[type="checkbox"], input[type="radio"]'
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]), textarea'

// 숨결 점: 로고의 살구 점이 마우스를 살짝 늦게 따라옴
// 누를 수 있는 곳 위에서는 세이지 딥 테두리 원으로 커지고, 글 입력칸 위에서는 사라짐
// 마우스가 없는 터치 화면에서는 그리지 않음 · '움직임 줄이기' 설정이면 늦게 따라오지 않음
export default function CursorDot() {
  const ref = useRef(null)

  useEffect(() => {
    let fine = false
    let reduce = false
    try {
      fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
      /* 무시 */
    }
    const el = ref.current
    if (!fine || !el) return

    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    let raf = 0
    let shown = false

    const tick = () => {
      const k = reduce ? 1 : 0.18 // 클수록 빨리 따라옴
      pos.x += (target.x - pos.x) * k
      pos.y += (target.y - pos.y) * k
      el.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      if (Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) raf = requestAnimationFrame(tick)
      else raf = 0
    }

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!shown) {
        // 처음 나타날 때는 커서 자리에서 바로 시작
        pos.x = target.x
        pos.y = target.y
        shown = true
      }
      const t = e.target instanceof Element ? e.target : null
      el.classList.toggle('is-hidden', Boolean(t?.closest(TEXT)))
      el.classList.toggle('is-link', Boolean(t?.closest(CLICKABLE)))
      el.classList.add('is-on')
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const onLeave = () => {
      el.classList.remove('is-on')
      shown = false
    }
    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden="true" className="cursor-dot">
      <span />
    </div>
  )
}
