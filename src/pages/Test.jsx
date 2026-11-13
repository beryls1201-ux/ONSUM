import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Icon from '../components/Icon.jsx'
import TestHeader from '../components/TestHeader.jsx'
import { img } from '../data/images.js'
import { QUESTIONS, decodeAnswers, encodeAnswers } from '../data/questions.js'
import './Test.css'

// P2-S1 질문 단계
export default function Test() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const gift = params.get('mode') === 'gift'
  // 결과 화면에서 '이전'으로 돌아오면 답을 그대로 두고 4번 질문부터
  const restored = decodeAnswers(params.get('a'))
  const [q, setQ] = useState(restored ? 3 : 0)
  const [answers, setAnswers] = useState(restored || [null, null, null, null])
  const [err, setErr] = useState(false)
  const [ripple, setRipple] = useState(null) // { q, i, x, y, n }

  const cur = QUESTIONS[q]
  const picked = answers[q]
  const hasPick = picked !== null
  const last = q === QUESTIONS.length - 1

  const back = () => {
    setErr(false)
    if (q === 0) navigate('/#choose')
    else setQ(q - 1)
  }

  const next = () => {
    if (!hasPick) {
      setErr(true)
      return
    }
    setErr(false)
    if (!last) {
      setQ(q + 1)
      return
    }
    const a = encodeAnswers(answers)
    navigate(`/result?a=${a}${gift ? '&m=gift' : ''}`)
  }

  const pick = (i) => {
    const a = answers.slice()
    a[q] = i
    setAnswers(a)
    setErr(false)
  }

  return (
    <div className="app">
      <TestHeader onBack={back} />
      <main>
        <section aria-labelledby="q-title" className="container p2-section">
          <div className="p2-progress">
            <p className="p2-progress-label">
              질문 <span className="num p2-progress-cur">{q + 1}</span> / <span className="num">4</span>
            </p>
            <div role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={q + 1} aria-label="진행 상황" className="p2-bar">
              <div className="p2-bar-fill" style={{ width: `${(q + 1) * 25}%` }} />
            </div>
          </div>

          <div className="p2-q" key={`t${q}`}>
            <h1 id="q-title" className="h1 p2-title">
              {gift ? cur.giftTitle : cur.title}
            </h1>
            <p className="p2-guide">{cur.guide}</p>
          </div>

          <fieldset className="p2-fieldset">
            <legend className="sr-only">선택지</legend>
            <div className="p2-q p2-options" key={`o${q}`}>
              {cur.options.map((o, i) => {
                const sel = picked === i
                const src = img(o.img)
                return (
                  <button
                    key={o.label}
                    type="button"
                    aria-pressed={sel}
                    className={`p2-opt${sel ? ' is-selected' : ''}`}
                    style={{ background: o.bg }}
                    onClick={(e) => {
                      // 누른 자리에서 물결이 퍼짐 (키보드로 고르면 가운데에서)
                      const r = e.currentTarget.getBoundingClientRect()
                      const byMouse = e.clientX !== 0 || e.clientY !== 0
                      setRipple({
                        q,
                        i,
                        x: byMouse ? e.clientX - r.left : r.width / 2,
                        y: byMouse ? e.clientY - r.top : r.height / 2,
                        n: (ripple?.n || 0) + 1,
                      })
                      pick(i)
                    }}
                  >
                    {src ? <img src={src} alt="" className="p2-opt-img" /> : <span className="p2-opt-ph">{o.img} · 250×240</span>}
                    <span aria-hidden="true" className="p2-opt-shade" />
                    {ripple?.q === q && ripple.i === i && <span key={ripple.n} aria-hidden="true" className="p2-ripple" style={{ left: ripple.x, top: ripple.y }} />}
                    {sel && (
                      <span aria-hidden="true" className="p2-opt-check">
                        <Icon name="check" size={18} stroke={2.2} />
                      </span>
                    )}
                    <span className="p2-opt-label">{o.label}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="p2-actions">
            {err && (
              <p role="alert" className="notice notice-chk">
                가장 마음에 드는 장면 하나를 선택해주세요.
              </p>
            )}
            <div className="p2-buttons">
              <button type="button" className="btn-ghost" onClick={back}>
                이전
              </button>
              <button type="button" className={`btn${hasPick ? '' : ' is-dim'}`} onClick={next}>
                <span>{last ? '추천 향 보기' : '다음 질문'}</span>
                <Icon name="right" />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
