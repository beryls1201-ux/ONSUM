import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Dot from '../components/Dot.jsx'
import Icon from '../components/Icon.jsx'
import Magnet from '../components/Magnet.jsx'
import Photo from '../components/Photo.jsx'
import Qty from '../components/Qty.jsx'
import useAdded from '../components/useAdded.js'
import useToast from '../components/useToast.js'
import { PRICE, SEASONS, SEASON_PHOTO, SCENTS, currentSeason, scentNotes, won } from '../data/scents.js'
import { useStore } from '../store/StoreContext.jsx'
import './Products.css'

const PHOTO_BG = {
  봄: 'linear-gradient(120deg, #EEF0DE 0%, #E3D9DC 100%)',
  여름: 'linear-gradient(120deg, #F4EDC8 0%, #D6E3E8 100%)',
  가을: 'linear-gradient(120deg, #EFD5B4 0%, #D3A576 100%)',
  겨울: 'linear-gradient(120deg, #F1EBE1 0%, #CFB6A3 100%)',
}

// P3-B8 담기 막대: 마우스가 가까이 오면 살짝 끌려오고(Magnet), 누르면 1.5초 동안 담았어요 표시
function AddBar({ onAdd }) {
  const [added, flash] = useAdded()
  return (
    <Magnet padding={40} magnetStrength={6} wrapperClassName="p3-addbar-wrap">
      <button
        type="button"
        className={`p3-addbar${added ? ' is-added' : ''}`}
        onClick={() => {
          onAdd()
          flash()
        }}
      >
        <Icon name={added ? 'check' : 'plus'} size={16} stroke={added ? 2.2 : 1.8} />
        <span>{added ? '담았어요' : '장바구니 담기'}</span>
      </button>
    </Magnet>
  )
}

// P3 향 소개(상품) — 주소가 바뀌면(메뉴·자세히 보기) 처음 상태로 다시 그림
export default function Products() {
  const location = useLocation()
  return <ProductsView key={location.key} />
}

function ProductsView() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const { testSeen, giftMode, addToCart, startCheckout } = useStore()

  // 기본 탭: 메뉴로 들어오면 현재 계절, '자세히 보기'로 오면 해당 향의 계절 + 그 향 선택 (미정 2-8 승인안)
  const paramSeason = params.get('season')
  const initSeason = SEASONS.includes(paramSeason) ? paramSeason : currentSeason()
  const initList = SCENTS.filter((s) => s.season === initSeason)
  const paramIdx = initList.findIndex((s) => s.id === Number(params.get('scent')))

  const [season, setSeason] = useState(initSeason)
  const [sel, setSel] = useState(paramIdx >= 0 ? paramIdx : 0) // 처음엔 첫 번째(아침) 향 선택 (미정 2-9 승인안)
  const [qty, setQty] = useState(1)
  const [toast, say] = useToast()
  const [buyAdded, flashBuy] = useAdded()

  // 선물 테스트 결과에서 들어온 경우에만 선물 모드 유지 (미정 2-6 승인안)
  const gift = Boolean(location.state?.fromResult && giftMode)

  const list = SCENTS.filter((s) => s.season === season)
  const s = sel === null ? null : list[sel]

  const pickSeason = (k) => {
    setSeason(k)
    setSel(0)
    setQty(1)
  }

  const add = (id, n) => {
    addToCart(id, n, gift)
    say('선택한 향을 장바구니에 담았어요.', 'ok')
  }

  const addSelected = () => {
    if (!s) return say('구매할 향을 먼저 선택해주세요.', 'chk')
    add(s.id, qty)
    flashBuy()
  }

  const buy = () => {
    if (!s) return say('구매할 향을 먼저 선택해주세요.', 'chk')
    startCheckout({ items: [{ id: s.id, qty }], gift, fromCart: false })
    navigate('/checkout')
  }

  return (
    <main>
      {/* P3-S1 계절 탭 */}
      <section aria-labelledby="p3-title" className="container p3-section">
        {!testSeen && (
          <aside aria-label="향 찾기 테스트 안내" className="p3-banner">
            <Photo id="IMG-P3-01" className="p3-banner-img" fallback="linear-gradient(160deg, #E8D6BC 0%, #D7BE9E 100%)" label="IMG-P3-01" />
            <div className="p3-banner-text">
              <p className="h4">어떤 향을 고를지 고민되나요?</p>
              <p className="p3-banner-sub">일상의 장면을 묻는 네 가지 질문에 답하고, 취향에 어울리는 향 3가지를 만나보세요.</p>
            </div>
            <Link to="/#choose" className="btn p3-banner-btn">
              <span>내 향 찾기</span>
              <Icon name="right" />
            </Link>
          </aside>
        )}

        <div className="head-group">
          <h1 id="p3-title" className="h1">
            계절과 시간으로 만나는 온숨의 향
          </h1>
          <p className="lead">
            봄·여름·가을·겨울의 아침·낮·밤을 담은 12가지 향이에요.
            <br />
            계절을 고른 뒤, 마음에 드는 향을 선택하면 아래에서 수량과 가격을 확인할 수 있어요.
          </p>
        </div>

        <div className="p3-tabs-wrap">
          <div role="tablist" aria-label="계절" className="p3-tabs">
            {SEASONS.map((k) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={k === season}
                className={`p3-tab${k === season ? ' is-on' : ''}`}
                onClick={() => pickSeason(k)}
              >
                {k}
              </button>
            ))}
          </div>
          <Photo
            key={season}
            id={SEASON_PHOTO[season]}
            className="p3-season-photo p3-fade"
            fallback={PHOTO_BG[season]}
            label={`${SEASON_PHOTO[season]} · ${season} 장면 사진 · 1200×200`}
          />
        </div>

        {/* 향 카드 3종 */}
        <div role="radiogroup" aria-label="향 선택" className="p3-cards">
          {list.map((it, i) => {
            const on = sel === i
            return (
              <article key={it.id} className={`p3-card p3-fade${on ? ' is-on' : ''}`}>
                <label className="p3-radio">
                  <input type="radio" name="scent" checked={on} onChange={() => {
                      setSel(i)
                      setQty(1)
                    }} />
                  <span>
                    {it.season} · {it.time}
                  </span>
                  <span className="p3-radio-dot">
                    <Dot color={it.color} />
                  </span>
                </label>
                <Photo id={it.img} className="p3-card-img" fallback={it.color} label={`${it.img} · 344×260`}>
                  <AddBar onAdd={() => add(it.id, 1)} />
                </Photo>
                <div className="p3-card-text">
                  <h2 className="p3-card-name">{it.name}</h2>
                  <p className="p3-card-lines">
                    {it.desc[0]}
                    <br />
                    {it.desc[1]}
                  </p>
                  <p className="p3-card-notes">{scentNotes(it)}</p>
                </div>
                <div className="easy">
                  <p className="easy-title">노트 쉽게 보기</p>
                  {it.easy.map(([n, e]) => (
                    <p key={n}>
                      {n} — {e}
                    </p>
                  ))}
                </div>
                <p className="price p3-card-price">
                  <span className="num">{won(PRICE)}</span>원
                </p>
              </article>
            )
          })}
        </div>
      </section>

      {/* P3-S2 구매 영역 */}
      <section id="purchase" aria-label="구매" className="container p3-buy-section">
        <div className="p3-buy on-linen">
          {s ? (
            <div className="p3-buy-item">
              <Photo id={s.img} className="p3-buy-thumb" fallback={s.color} label=" " />
              <div className="p3-buy-info">
                <p className="h4 p3-buy-title">
                  <Dot color={s.color} />
                  <span>
                    {s.season} {s.time} · {s.name}
                  </span>
                </p>
                <p className="p3-buy-notes">{scentNotes(s)}</p>
              </div>
            </div>
          ) : (
            <p className="p3-buy-empty">위에서 마음에 드는 향을 선택해주세요.</p>
          )}
          <Qty value={qty} onChange={setQty} />
          <div className="p3-buy-total">
            <span className="p3-buy-total-label">상품 금액</span>
            <span className="p3-buy-total-val">
              <span className="num">{won(s ? PRICE * qty : 0)}</span>원
            </span>
          </div>
          <div className="p3-buy-actions">
            <Magnet padding={60} magnetStrength={4}>
              <button type="button" className={`btn-ghost p3-buy-add${buyAdded ? ' is-added' : ''}`} onClick={addSelected}>
                {buyAdded ? (
                  <>
                    <Icon name="check" size={18} stroke={2.2} />
                    <span>담았어요</span>
                  </>
                ) : (
                  '장바구니 담기'
                )}
              </button>
            </Magnet>
            <button type="button" className="btn" onClick={buy}>
              <span>바로 결제</span>
              <Icon name="right" />
            </button>
          </div>
        </div>
        <div className="p3-toast">
          <p role="status" className={toast ? `notice notice-${toast.kind}` : 'p3-toast-empty'}>
            {toast ? toast.msg : ''}
          </p>
        </div>
      </section>
    </main>
  )
}
