import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import Dot from '../components/Dot.jsx'
import Footer from '../components/Footer.jsx'
import Icon from '../components/Icon.jsx'
import Photo from '../components/Photo.jsx'
import TestHeader from '../components/TestHeader.jsx'
import Tilt from '../components/Tilt.jsx'
import useToast from '../components/useToast.js'
import { decodeAnswers, rankScents, summarize } from '../data/questions.js'
import { PRICE, scentNotes, scentTitle, won } from '../data/scents.js'
import { useStore } from '../store/StoreContext.jsx'
import './Result.css'

function reduceMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// 태블릿·모바일(화면 폭 1023px 이하 또는 터치 기기)인지 확인 — mobile-interaction.css와 같은 기준
function isTabletOrMobile() {
  try {
    return window.matchMedia('(max-width: 1023px), (hover: none) and (pointer: coarse)').matches
  } catch {
    return false
  }
}

// P2-S2 결과 화면 (결과 링크로 열면 같은 결과)
export default function Result() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const a = params.get('a')
  const answers = useMemo(() => decodeAnswers(a), [a])
  const gift = params.get('m') === 'gift'
  const { addToCart, setGiftMode, markTestSeen, startCheckout } = useStore()
  const [loading, setLoading] = useState(() => !reduceMotion())
  const [toast, say] = useToast()

  useEffect(() => {
    if (!answers) return
    markTestSeen()
    setGiftMode(gift)
  }, [answers, gift, markTestSeen, setGiftMode])

  // 전환 상태: 빛(동그라미 3겹)이 1.5초 퍼진 뒤 결과 표시
  useEffect(() => {
    if (!loading) return
    const t = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(t)
  }, [loading])

  // 16. 태블릿·모바일(화면 폭 1023px 이하 또는 터치 기기)에서만 전환 상태를 1초로 줄임 (docs/interaction.md)
  // 데스크톱(1024px 이상 + 마우스)에서는 바로 끝나서 위의 1.5초가 그대로 적용됨
  useEffect(() => {
    if (!loading || !isTabletOrMobile()) return
    const t = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(t)
  }, [loading])

  if (!answers) return <Navigate to="/#choose" replace />

  const [first, second, third] = rankScents(answers)
  const sum = summarize(answers, first)

  const detail = (s) => navigate(`/products?season=${encodeURIComponent(s.season)}&scent=${s.id}`, { state: { fromResult: true } })

  const buyNow = () => {
    startCheckout({ items: [{ id: first.id, qty: 1 }], gift, fromCart: false })
    navigate('/checkout')
  }

  const addCart = () => {
    addToCart(first.id, 1, gift)
    navigate('/cart')
  }

  const copy = () => {
    const ok = () => say('추천 결과 링크를 복사했어요.', 'ok')
    const fail = () => say('링크를 복사하지 못했어요. 한 번 더 눌러 주세요.', 'err')
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(window.location.href).then(ok, fail)
      else fail()
    } catch {
      fail()
    }
  }

  return (
    <div className="app">
      <TestHeader onBack={() => navigate(`/test?a=${a}${gift ? '&mode=gift' : ''}`)} />
      <main>
        {loading ? (
          <section aria-live="polite" className="container p2r-loading">
            <div aria-hidden="true" className="p2r-glow">
              <span className="p2r-ring" />
              <span className="p2r-ring r2" />
              <span className="p2r-ring r3" />
              <span className="p2r-core" />
            </div>
            <div className="p2r-loading-text">
              <p className="p2r-loading-title">답변에 어울리는 향을 고르고 있어요</p>
              <p className="p2r-loading-sub">계절 · 시간대 · 향의 느낌을 살펴보는 중</p>
            </div>
          </section>
        ) : (
          <section aria-labelledby="result-title" className="container p2r-section">
            <div className="head-group">
              <h1 id="result-title" className="h1">
                당신의 취향과 닮은 향 3가지
              </h1>
              <p className="lead">고른 장면에 담긴 분위기를 따라 어울리는 향 세 가지를 골랐어요.</p>
            </div>

            {/* 나의 향 이야기 */}
            <section aria-labelledby="story-title" className="p2r-story">
              <h2 id="story-title" className="p2r-story-title">
                {gift ? '그 사람의 향 이야기' : '나의 향 이야기'}
              </h2>
              <dl className="p2r-dl">
                <div className="p2r-row">
                  <dt>계절</dt>
                  <dd>
                    <span className="p2r-val">{sum.season}</span>
                    <span className="p2r-chips">
                      {sum.seasonPicks.map((p, i) => (
                        <span key={i} className="p2r-chip">
                          {p}
                        </span>
                      ))}
                    </span>
                  </dd>
                </div>
                <div className="p2r-row">
                  <dt>시간대</dt>
                  <dd>
                    <span className="p2r-val">{sum.time}</span>
                    <span className="p2r-chip">{sum.timePick}</span>
                  </dd>
                </div>
                <div className="p2r-row is-last">
                  <dt>향의 느낌</dt>
                  <dd>
                    <span className="p2r-val">{sum.feel}</span>
                    <span className="p2r-chip">끌리는 향의 느낌</span>
                  </dd>
                </div>
              </dl>
            </section>

            {/* 1위 카드 */}
            <article aria-label="추천 1위" className="p2r-first photo-zoom-host">
              <Photo id={first.img} className="p2r-first-img photo-zoom" fallback={first.color} label={`${first.img} · ${first.name} · 560×380`} />
              <div className="p2r-first-body">
                <div className="p2r-rank-row">
                  <span className="p2r-rank p2r-rank-pop">
                    <span className="num">1</span>위
                  </span>
                  <Dot color={first.color} size={20} />
                </div>
                <div className="p2r-first-text">
                  <h2 className="p2r-first-name">{scentTitle(first)}</h2>
                  <p className="p2r-first-line">{first.line}</p>
                  <p className="p2r-notes">{scentNotes(first)}</p>
                </div>
                <div className="easy p2r-easy">
                  <p className="easy-title">노트 쉽게 보기</p>
                  {first.easy.map(([n, e]) => (
                    <p key={n}>
                      <strong>{n}</strong> — {e}
                    </p>
                  ))}
                </div>
                <p className="p2r-price">
                  <span className="num">{won(PRICE)}</span>원
                </p>
                <div className="p2r-first-actions on-linen">
                  <button type="button" className="btn" onClick={buyNow}>
                    바로 결제
                  </button>
                  <button type="button" className="btn-ghost" onClick={addCart}>
                    장바구니 담기
                  </button>
                  <button type="button" className="p2r-textlink" onClick={() => detail(first)}>
                    자세히 보기
                  </button>
                </div>
              </div>
            </article>

            {/* 2·3위 카드 */}
            <div className="p2r-rest">
              {[second, third].map((s, i) => (
                <Tilt key={s.id} as="article" max={4} lift={4} aria-label={`추천 ${i + 2}위`} className="p2r-card on-linen photo-zoom-host">
                  <div className="p2r-rank-row">
                    <span className="p2r-rank p2r-rank-sm">
                      <span className="num">{i + 2}</span>위
                    </span>
                    <Dot color={s.color} size={18} />
                  </div>
                  <Photo id={s.img} className="p2r-card-img photo-zoom" fallback={s.color} label={`${s.img} · 548×200`} />
                  <div className="p2r-card-text">
                    <h3 className="p2r-card-name">{scentTitle(s)}</h3>
                    <p className="p2r-card-line">{s.line}</p>
                    <p className="p2r-notes">{scentNotes(s)}</p>
                  </div>
                  <div className="p2r-card-foot">
                    <p className="price">
                      <span className="num">{won(PRICE)}</span>원
                    </p>
                    <button type="button" className="btn-ghost btn-sm" onClick={() => detail(s)}>
                      자세히 보기
                    </button>
                  </div>
                </Tilt>
              ))}
            </div>

            {/* 다시 하기 · 링크 복사 */}
            <div className="p2r-again">
              <div className="p2r-again-buttons">
                <Link to="/#choose" className="btn-ghost">
                  <Icon name="retry" />
                  <span>테스트 다시 하기</span>
                </Link>
                <button type="button" className="btn-ghost" onClick={copy}>
                  <Icon name="link" />
                  <span>결과 링크 복사</span>
                </button>
              </div>
              <p role="status" className={toast ? `notice notice-${toast.kind}` : 'p2r-status-empty'} style={{ alignSelf: 'center' }}>
                {toast ? toast.msg : ''}
              </p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
