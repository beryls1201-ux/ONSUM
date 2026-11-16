import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Photo from '../components/Photo.jsx'
import Spotlight from '../components/Spotlight.jsx'
import Tilt from '../components/Tilt.jsx'
import { useStore } from '../store/StoreContext.jsx'
import './Main.css'

function reduceMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// 숫자 4 · 12 · 3: 화면에 들어올 때 0에서 0.9초 카운트업, 끝으로 갈수록 느려짐
function useCountUp(ref) {
  const [t, setT] = useState(() => (reduceMotion() ? 1 : 0))
  useEffect(() => {
    if (reduceMotion() || !ref.current) return
    let raf = 0
    const run = () => {
      let start = null
      const step = (ts) => {
        if (start === null) start = ts
        const p = Math.min(1, (ts - start) / 900)
        setT(1 - Math.pow(1 - p, 3))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect()
        run()
      }
    })
    io.observe(ref.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [ref])
  return t
}

const STEPS = ['장면 질문 4개', '어울리는 향 3가지 추천', '바로 구매 또는 선물 카드']

export default function Main() {
  const navigate = useNavigate()
  const { setGiftMode } = useStore()
  const statsRef = useRef(null)
  const t = useCountUp(statsRef)

  const start = (gift) => {
    setGiftMode(gift)
    navigate(gift ? '/test?mode=gift' : '/test')
  }

  return (
    <main id="top">
      {/* P1-S1 첫 화면 */}
      <section aria-labelledby="hero-title" className="container p1-hero-wrap">
        <Photo id="IMG-P1-01" className="p1-hero" fallback="linear-gradient(180deg, #D9C4A6 0%, #C9AE8D 100%)" label="IMG-P1-01 · 따뜻한 방 사진 · 1200×520">
          <Spotlight className="p1-glass" color="#FFF6E4" intensity={0.1} size={240}>
            <h1 id="hero-title" className="h1">
              취향을 따라,
              <br />
              나에게 닿는 향
            </h1>
            <p className="p1-glass-body">
              오늘 하루를 떠올리며 네 가지 장면에 답해 보세요.
              <br />
              온숨의 12가지 향 가운데 잘 어울리는 3가지를 골라 드려요.
              <br />
              나를 위한 향도, 소중한 사람에게 건넬 선물도 찾아보세요.
            </p>
            <div className="p1-stats" ref={statsRef}>
              <div>
                <span className="num p1-stat-num">{Math.round(4 * t)}</span>
                <span className="p1-stat-label">장면 질문</span>
              </div>
              <div>
                <span className="num p1-stat-num">{Math.round(12 * t)}</span>
                <span className="p1-stat-label">계절 · 시간의 향</span>
              </div>
              <div>
                <span className="num p1-stat-num">{Math.round(3 * t)}</span>
                <span className="p1-stat-label">추천 향</span>
              </div>
            </div>
            <div>
              <a
                href="#choose"
                className="btn"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('choose')?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' })
                }}
              >
                <span>내 향 찾기</span>
                <Icon name="down" />
              </a>
            </div>
          </Spotlight>
        </Photo>
      </section>

      {/* P1-S2 나 / 선물 선택 */}
      <section id="choose" aria-labelledby="choose-title" className="container p1-choose">
        <div className="head-group" style={{ maxWidth: 720 }}>
          <h2 id="choose-title" className="h2">
            누구를 위한 향을 찾으시나요?
          </h2>
          <p className="lead">나를 위한 향인지, 누군가에게 건넬 향인지 골라 주세요. 바로 네 가지 질문이 시작돼요.</p>
        </div>

        <ol aria-label="진행 순서" className="p1-steps">
          {STEPS.map((s, i) => (
            <li key={s} className="p1-step-wrap">
              {i > 0 && <span aria-hidden="true" className="p1-step-line" />}
              <span className="p1-step">
                <span className="p1-step-num num">{i + 1}</span>
                <span>{s}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="p1-cards">
          <Tilt as="article" max={4} lift={4} className="p1-card">
            <Photo id="IMG-P1-02" className="p1-card-img" fallback="linear-gradient(160deg, #E4D2B8 0%, #D6BE9C 100%)" label="IMG-P1-02 · 548×240" />
            <div className="p1-card-text">
              <h3 className="h3">나의 일상에 어울리는 향</h3>
              <p>
                내가 좋아하는 일상의 장면을 골라 주세요.
                <br />
                고른 장면의 분위기에 어울리는 향 3가지를 추천해 드려요.
              </p>
            </div>
            <div className="p1-card-cta">
              <button type="button" className="btn" onClick={() => start(false)}>
                <span>나를 위한 향 찾기</span>
                <Icon name="right" />
              </button>
            </div>
          </Tilt>

          <Tilt as="article" max={4} lift={4} className="p1-card">
            <Photo id="IMG-P1-03" className="p1-card-img" fallback="linear-gradient(160deg, #E6D6C6 0%, #D3B9A3 100%)" label="IMG-P1-03 · 548×240" />
            <div className="p1-card-text">
              <h3 className="h3">그 사람을 떠올리게 하는 향</h3>
              <p>
                선물받을 사람이 좋아할 장면을 떠올리며 답해 주세요.
                <br />
                향을 고른 뒤 메시지 카드와 포장도 함께 고를 수 있어요.
              </p>
            </div>
            <div className="p1-card-cta">
              <button type="button" className="btn" onClick={() => start(true)}>
                <span>선물할 향 찾기</span>
                <Icon name="right" />
              </button>
            </div>
          </Tilt>
        </div>
      </section>
    </main>
  )
}
