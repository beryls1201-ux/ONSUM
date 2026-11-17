import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { logo } from '../data/images.js'

function reduceMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// C-FTR 푸터 (모든 페이지)
export default function Footer() {
  // 페이지 끝에 닿으면 로고가 왼쪽부터 천천히 드러남
  // 로고 자체는 잘려 있어 보이지 않으므로 감싼 영역이 화면에 들어오는지를 봄
  // (글자별로 나눈 로고 SVG가 생기면 '한 글자씩 올라옴'으로 바꿀 자리)
  const logoRef = useRef(null)
  const [shown, setShown] = useState(() => reduceMotion())

  useEffect(() => {
    if (shown || !logoRef.current) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.6 },
    )
    io.observe(logoRef.current)
    return () => io.disconnect()
  }, [shown])

  return (
    <footer className="ftr">
      <div className="container ftr-inner">
        <div className="ftr-top">
          <p className="ftr-text">
            <strong>온숨</strong> · 취향을 발견하고, 향으로 마음을 전하세요.
            <br />
            향 선택부터 주문 확인까지, 필요한 안내를 만나 보세요.
          </p>
          <nav aria-label="고객 안내" className="ftr-nav">
            <Link to="/help#faq">배송·교환 안내</Link>
            <Link to="/help#inquiry">문의</Link>
            <Link to="/help#lookup">비회원 주문 조회</Link>
          </nav>
        </div>
        <div className="ftr-logo" ref={logoRef}>
          <img src={logo} alt="onsum" className={`ftr-logo-img${shown ? ' is-shown' : ''}`} />
        </div>
      </div>
    </footer>
  )
}
