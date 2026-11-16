import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { logo } from '../data/images.js'
import { useStore } from '../store/StoreContext.jsx'
// 태블릿·모바일 햄버거 메뉴용 (docs/interaction.md 7장) — 데스크톱에서는 CSS로 숨김
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import Icon from './Icon.jsx'

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

  // 태블릿·모바일 햄버거 메뉴: 열림 상태
  const [menuOpen, setMenuOpen] = useState(false)
  const menuCloseRef = useRef(null)
  const { pathname, hash } = useLocation()

  // 페이지를 옮기면(메뉴 링크 포함) 닫힘
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname, hash])

  // 열려 있는 동안: 뒤 화면 스크롤 막기, Esc로 닫기, 닫기 버튼에 포커스
  // 스크롤을 막으면 스크롤바가 사라지며 화면 폭이 넓어지므로, 그 폭만큼 오른쪽 여백을 채워 이미지·카드 크기가 변하지 않게 함
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    const prevPad = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    if (scrollbar > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    menuCloseRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
      document.body.style.paddingRight = prevPad
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

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
        {/* 태블릿·모바일 전용: 장바구니 + 햄버거 버튼 (데스크톱에서는 CSS로 숨김) */}
        <div className="gnb-m">
          <NavLink to="/cart" className={navClass} aria-label={`장바구니, 담긴 향 ${cartCount}개`}>
            <span>장바구니</span>
            <span className={`gnb-badge num${pop ? ' is-pop' : ''}`}>{cartCount}</span>
          </NavLink>
          <button type="button" className="gnb-burger" aria-label="메뉴 열기" aria-expanded={menuOpen} aria-controls="gnb-drawer" onClick={() => setMenuOpen(true)}>
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
        </div>
      </nav>
      {/* 태블릿·모바일 전용: 오른쪽에서 밀려 나오는 메뉴. 헤더의 흐림 효과 안에서는 화면 전체를 덮지 못해 body로 옮겨 그림 */}
      {createPortal(
        <div className={`gnb-drawer-wrap${menuOpen ? ' is-open' : ''}`} inert={!menuOpen}>
          <div className="gnb-scrim" aria-hidden="true" onClick={() => setMenuOpen(false)} />
          <div id="gnb-drawer" role="dialog" aria-modal="true" aria-label="주 메뉴" className="gnb-drawer">
            <div className="gnb-drawer-head">
              <button type="button" ref={menuCloseRef} className="gnb-drawer-close" aria-label="메뉴 닫기" onClick={() => setMenuOpen(false)}>
                <Icon name="close" size={20} />
              </button>
            </div>
            <nav aria-label="주 메뉴" className="gnb-drawer-nav" onClick={(e) => e.target.closest('a') && setMenuOpen(false)}>
              <NavLink to="/brand" className={({ isActive }) => `gnb-drawer-link${isActive ? ' is-current' : ''}`}>
                브랜드 소개
              </NavLink>
              <Link to="/#choose" className="gnb-drawer-link">
                향 찾기
              </Link>
              <NavLink to="/products" className={({ isActive }) => `gnb-drawer-link${isActive ? ' is-current' : ''}`}>
                향 소개
              </NavLink>
            </nav>
          </div>
        </div>,
        document.body,
      )}
    </header>
  )
}
