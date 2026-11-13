import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { logo } from '../data/images.js'
import { useStore } from '../store/StoreContext.jsx'

// C-GNB 상단 메뉴 (P2 제외 모든 페이지)
export default function Header() {
  const { cartCount, bump } = useStore()
  const [pop, setPop] = useState(false)
  const first = useRef(true)

  // 담기 직후 숫자 원이 한 번 살짝 커졌다 돌아옴
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setPop(true)
    const t = setTimeout(() => setPop(false), 220)
    return () => clearTimeout(t)
  }, [bump])

  const navClass = ({ isActive }) => `gnb-link${isActive ? ' is-current' : ''}`

  return (
    <header className="gnb">
      <nav aria-label="주 메뉴" className="gnb-inner">
        <Link to="/" aria-label="온숨 메인으로" className="gnb-logo">
          <img src={logo} alt="onsum" />
        </Link>
        <div className="gnb-menu">
          <NavLink to="/brand" className={navClass}>
            브랜드 소개
          </NavLink>
          <Link to="/#choose" className="gnb-link">
            향 찾기
          </Link>
          <NavLink to="/products" className={navClass}>
            향 소개
          </NavLink>
          <NavLink to="/cart" className={navClass} aria-label={`장바구니, 담긴 향 ${cartCount}개`}>
            <span>장바구니</span>
            <span className={`gnb-badge num${pop ? ' is-pop' : ''}`}>{cartCount}</span>
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
