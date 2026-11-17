import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Dot from '../components/Dot.jsx'
import Icon from '../components/Icon.jsx'
import Photo from '../components/Photo.jsx'
import Tilt from '../components/Tilt.jsx'
import { img } from '../data/images.js'
import { SEASONS, SCENTS } from '../data/scents.js'
import './Brand.css'

function reduceMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

const SCENES = [
  { label: '아침 · 창가', id: 'IMG-P5-02', bg: 'linear-gradient(160deg, #F7EAD3 0%, #EBD6B6 100%)' },
  { label: '낮 · 꽃병 옆', id: 'IMG-P5-03', bg: 'linear-gradient(160deg, #F1DDB8 0%, #DDBE8E 100%)' },
  { label: '밤 · 무드등 아래', id: 'IMG-P5-04', bg: 'linear-gradient(160deg, #5A4A40 0%, #3A2F2A 100%)' },
]

const STEPS = ['장면 질문 4개', '어울리는 향 3가지 추천', '바로 구매 또는 선물 카드']

// P5 브랜드 소개
export default function Brand() {
  const [step, setStep] = useState(0)
  const [manual, setManual] = useState(false)
  const marks = useRef([])

  // 스크롤 장면 3단계: 같은 방 일러스트가 아침 → 낮 → 밤 (움직임 줄이기면 아침 그림만)
  useEffect(() => {
    if (reduceMotion() || manual) return
    const onScroll = () => {
      const mid = window.innerHeight / 2
      let cur = 0
      marks.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) cur = i
      })
      setStep(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [manual])

  return (
    <main>
      {/* 1. 대표 이미지 · 소개 */}
      <section aria-labelledby="brand-title" className="container p5-intro">
        <Photo id="IMG-P5-01" className="p5-hero" fallback="linear-gradient(170deg, #E3CFB2 0%, #CDAE89 100%)" label="IMG-P5-01 · 브랜드 대표 이미지 · 1200×420" />
        <div className="p5-intro-grid">
          <h1 id="brand-title" className="h1 p5-title">
            온숨,
            <br />
            일상에 향으로 건네는 쉼
          </h1>
          <p className="p5-body">
            창문을 열었을 때 스치는 공기, 따뜻한 찻잔 곁의 여유, 하루 끝의 고요함.
            <br />
            온숨은 익숙한 일상의 장면을 향으로 전합니다.
            <br />
            봄·여름·가을·겨울마다 아침·낮·밤을 담은 3가지 향, 모두 12가지.
            <br />
            계절과 시간을 따라, 지금의 나와 소중한 사람에게 어울리는 향을 만나 보세요.
          </p>
        </div>
      </section>

      {/* 2. 원룸 일러스트 + 장면 표시 */}
      <section aria-labelledby="scene-title" className="container p5-block">
        <div className="p5-split">
          <Photo id="IMG-P5-02" className="p5-illust" fallback="#F1E3CC" label="IMG-P5-02 · 원룸 일러스트(아침) · 580×320">
            <span className="p5-pin" style={{ left: '13%', top: '18%' }}>
              <span aria-hidden="true" />
              아침 · 창가
            </span>
            <span className="p5-pin" style={{ left: '42%', top: '52%' }}>
              <span aria-hidden="true" />낮 · 꽃병 옆
            </span>
            <span className="p5-pin" style={{ right: '8%', top: '26%' }}>
              <span aria-hidden="true" />밤 · 무드등 아래
            </span>
          </Photo>
          <div className="p5-split-text">
            <h2 id="scene-title" className="h2">
              이름보다 먼저,
              <br />
              장면으로 만나는 향
            </h2>
            <p className="p5-body">
              어려운 향료 이름 대신, 좋아하는 장면부터 떠올려 보세요.
              <br />
              네 가지 질문에 답하면 나와 어울리는 향 3가지를 추천해 드려요.
              <br />
              직접 고르고 싶다면 계절별 향 소개에서 주요 노트와 분위기를 살펴보세요.
              <br />
              차 한 잔의 여유부터 고요한 독서 시간까지, 나다운 순간을 찾아보세요.
            </p>
          </div>
        </div>
      </section>

      {/* 3. 스크롤 장면 3단계 */}
      <section aria-label="같은 방의 아침, 낮, 밤" className="container p5-block">
        <div className="p5-scroll">
          {SCENES.map((s, i) => (
            <div key={s.id} aria-hidden="true" className="p5-mark" style={{ top: i * 320 }} ref={(el) => (marks.current[i] = el)} />
          ))}
          <div className="p5-sticky">
            <div className="p5-stage">
              {SCENES.map((s, i) => {
                const src = img(s.id)
                return (
                  <div key={s.id} className={`p5-layer${i === step ? ' is-on' : ''}${src ? '' : ' is-ph'}${i === 2 ? ' is-night' : ''}`} style={{ background: s.bg }}>
                    {src ? <img src={src} alt="" /> : <span className="p5-layer-ph">{s.id}</span>}
                  </div>
                )
              })}
              <p aria-live="polite" className={`p5-chip${step === 2 ? ' is-night' : ''}`}>
                {SCENES[step].label}
              </p>
            </div>
            <div role="group" aria-label="장면 선택" className="p5-steps">
              {SCENES.map((s, i) => {
                const src = img(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={i === step}
                    className={`p5-step${i === step ? ' is-on' : ''}`}
                    onClick={() => {
                      setManual(true)
                      setStep(i)
                    }}
                  >
                    <span aria-hidden="true" className="p5-step-thumb" style={{ background: s.bg }}>
                      {src && <img src={src} alt="" />}
                    </span>
                    <span className="p5-step-label">{s.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 선물 이야기 */}
      <section aria-labelledby="gift-title" className="container p5-block">
        <div className="p5-split is-reverse">
          <div className="p5-split-text">
            <h2 id="gift-title" className="h2">
              향에 마음을 더해 전하세요
            </h2>
            <p className="p5-body">
              선물 받을 사람이 좋아할 장면을 떠올리며 향을 골라 보세요.
              <br />
              향의 이름·주요 노트·장면을 담은 무료 메시지 카드에
              <br />
              최대 100자의 인사를 더할 수 있어요. 선물 포장을 선택하면
              <br />
              크라프트 상자와 향의 대표 색 리본이 더해져요. 포장비는 3,000원이에요.
            </p>
          </div>
          <Photo id="IMG-P5-05" className="p5-gift-img" fallback="linear-gradient(160deg, #E9D7BF 0%, #D2B48F 100%)" label="IMG-P5-05 · 메시지 카드 · 선물 포장 · 580×320" />
        </div>
      </section>

      {/* 5. 버튼: 두 갈래 카드 */}
      <section aria-label="다음으로" className="container p5-block p5-last">
        <div className="p5-cards">
          <Tilt as="article" max={4} className="p5-card">
            <div className="p5-card-head">
              <h2 className="h3">향 찾기</h2>
              <p>네 가지 질문에 답하면 나와 어울리는 향 3가지를 추천해 드려요.</p>
            </div>
            <ol aria-label="진행 순서" className="p5-card-steps">
              {STEPS.map((s, i) => (
                <li key={s}>
                  <span className="num">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <div className="p5-card-cta">
              <Link to="/#choose" className="btn">
                <span>향 찾기 시작</span>
                <Icon name="right" />
              </Link>
            </div>
          </Tilt>

          <Tilt as="article" max={4} className="p5-card on-linen">
            <div className="p5-card-head">
              <h2 className="h3">향 소개</h2>
              <p>봄·여름·가을·겨울의 아침·낮·밤을 담은 12가지 향이에요.</p>
            </div>
            <div role="img" aria-label="계절별 아침, 낮, 밤 향의 대표 색 12가지" className="p5-palette">
              {SEASONS.map((k) => (
                <div key={k}>
                  <span className="p5-palette-label">{k}</span>
                  <div className="p5-palette-dots">
                    {SCENTS.filter((s) => s.season === k).map((s) => (
                      <Dot key={s.id} color={s.color} size={20} title={s.name} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p5-card-cta">
              <Link to="/products" className="btn-ghost">
                향 소개 보기
              </Link>
            </div>
          </Tilt>
        </div>
      </section>
    </main>
  )
}
