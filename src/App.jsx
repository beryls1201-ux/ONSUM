import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import CursorDot from './components/CursorDot.jsx'
import Footer from './components/Footer.jsx'
import Main from './pages/Main.jsx'
import Test from './pages/Test.jsx'
import Result from './pages/Result.jsx'
import Products from './pages/Products.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Complete from './pages/Complete.jsx'
import Brand from './pages/Brand.jsx'
import Help from './pages/Help.jsx'

function reduceMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// 주소가 바뀌면 맨 위로, #해시가 있으면 그 섹션으로 이동
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function SiteLayout() {
  return (
    <div className="app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <CursorDot />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/complete" element={<Complete />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/help" element={<Help />} />
        </Route>
        {/* P2는 테스트 헤더(C-TGNB)를 쓰므로 페이지 안에서 헤더를 그림 */}
        <Route path="/test" element={<Test />} />
        <Route path="/result" element={<Result />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
