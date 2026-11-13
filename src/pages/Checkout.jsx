import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Dot from '../components/Dot.jsx'
import Photo from '../components/Photo.jsx'
import Tilt from '../components/Tilt.jsx'
import { img } from '../data/images.js'
import { PRICE, WRAP_FEE, getScent, scentNotes, scentTitle, won } from '../data/scents.js'
import { useStore } from '../store/StoreContext.jsx'
import './Cart.css'
import './Checkout.css'

const PAYS = ['신용카드', '계좌이체', '간편결제']
// 배송 메모 선택지 (미정 2-12 승인안)
const MEMOS = ['문 앞에 놓아주세요', '경비실에 맡겨주세요', '택배함에 넣어주세요', '배송 전 연락 부탁드려요']
const MSG_EXAMPLE = '당신의 하루에도 따뜻한 쉼이 머물기를.'

// 주소 검색: 외부 서비스 없이 화면 안 팝업에서 직접 입력 (미정 2-13 승인안)
function AddressDialog({ initial, onClose, onDone }) {
  const [v, setV] = useState(initial)
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="p4c-dialog-back" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="addr-title" className="p4c-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 id="addr-title" className="h4">
          주소 검색
        </h2>
        <div className="field">
          <label htmlFor="addr-q">도로명 또는 지번 주소</label>
          <input ref={ref} id="addr-q" className="input" type="text" value={v} onChange={(e) => setV(e.target.value)} />
        </div>
        <div className="p4c-dialog-actions">
          <button type="button" className="btn-ghost btn-xs" onClick={onClose}>
            닫기
          </button>
          <button type="button" className="btn btn-xs" onClick={() => onDone(v.trim())}>
            주소 입력
          </button>
        </div>
      </div>
    </div>
  )
}

// P4-S2 선물 옵션 · P4-S3 결제
export default function Checkout() {
  const navigate = useNavigate()
  const { checkout, placeOrder } = useStore()
  const [f, setF] = useState(() => ({
    gift: Boolean(checkout?.gift),
    msg: '',
    wrap: false,
    name: '',
    phone: '',
    pw: '',
    to: '',
    addr: '',
    detail: '',
    memo: '',
    pay: '신용카드',
    agree1: false,
    agree2: false,
  }))
  const [tried, setTried] = useState(false)
  const [addrOpen, setAddrOpen] = useState(false)
  const [paid, setPaid] = useState(false)

  // 결제 직후에는 주문 완료로 넘어가는 중이므로 장바구니로 돌려보내지 않음
  if (paid) return null
  if (!checkout || !checkout.items?.length) return <Navigate to="/cart" replace />

  const items = checkout.items.map((it) => ({ ...it, scent: getScent(it.id) })).filter((x) => x.scent)
  const card = items[0].scent // 여러 향이면 카드 1장, 첫 번째 향 (미정 2-7 승인안)
  const goods = items.reduce((n, x) => n + PRICE * x.qty, 0)
  const wrapFee = f.gift && f.wrap ? WRAP_FEE : 0
  const total = goods + wrapFee

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))
  const toggle = (k) => () => setF((s) => ({ ...s, [k]: !s[k] }))

  const okName = f.name.trim().length > 0
  const okPhone = /^01[0-9]{8,9}$/.test(f.phone.replace(/[^0-9]/g, ''))
  const okPw = /^[0-9]{4}$/.test(f.pw) // 주문 비밀번호: 숫자 4자리 (미정 2-14 승인안)
  const okDetail = f.detail.trim().length > 0
  const okAgree = f.agree1 && f.agree2
  const ready = okName && okPhone && okPw && okDetail && okAgree

  const pay = () => {
    setTried(true)
    if (!ready) return
    setPaid(true)
    placeOrder({ password: f.pw, gift: f.gift, wrap: f.wrap })
    navigate('/complete')
  }

  const errCls = (ok) => `input${tried && !ok ? ' is-error' : ''}`
  const cardBg = img('IMG-P4-02')

  return (
    <main>
      <div className="container p4-section">
      <h1 className="h1">주문 · 결제</h1>

      <div className="p4-layout">
        <div className="p4c-main">
          {/* P4-S2 선물 옵션 */}
          <section aria-labelledby="gift-title" className="p4c-panel">
            <div className="p4c-gift-head">
              <h2 id="gift-title" className="p4c-panel-title">
                선물로 보내기
              </h2>
              <button type="button" role="switch" aria-checked={f.gift} aria-label="선물로 보내기" className={`p4c-switch${f.gift ? ' is-on' : ''}`} onClick={toggle('gift')}>
                <span className="p4c-knob" />
              </button>
            </div>

            {f.gift && (
              <div className="p4c-gift-body">
                <div className="p4c-card-col">
                  <p className="p4c-card-cap">무료 메시지 카드 · 문구 예시</p>
                  {/* 마우스를 올리면 종이 카드처럼 은은하게 기울어짐 (최대 6도) */}
                  <Tilt max={6} className="p4c-card" style={cardBg ? { backgroundImage: `url(${cardBg})` } : undefined}>
                    <span aria-hidden="true" className="p4c-card-band" style={{ background: card.color }} />
                    <div className="p4c-card-text">
                      <p className="p4c-card-name">{scentTitle(card)}</p>
                      <p className="p4c-card-notes">{scentNotes(card)}</p>
                      <p className="p4c-card-scene">{card.desc[0]}</p>
                      <p className={`p4c-card-msg${f.msg ? '' : ' is-example'}`}>{f.msg || MSG_EXAMPLE}</p>
                    </div>
                  </Tilt>
                </div>
                <div className="p4c-gift-form">
                  <div className="field">
                    <label htmlFor="gift-msg">보내는 사람 메시지</label>
                    <textarea
                      id="gift-msg"
                      className="input p4c-textarea"
                      maxLength={100}
                      rows={4}
                      value={f.msg}
                      placeholder={MSG_EXAMPLE}
                      onChange={(e) => setF((s) => ({ ...s, msg: e.target.value.slice(0, 100) }))}
                    />
                    <span className="p4c-count">
                      <span className="num">{f.msg.length}</span> / 100
                    </span>
                  </div>
                  <label className="p4c-wrap">
                    <input type="checkbox" className="checkbox" checked={f.wrap} onChange={toggle('wrap')} />
                    <span className="p4c-wrap-text">
                      <span className="p4c-wrap-title">
                        선물 포장 추가{' '}
                        <span className="p4c-wrap-fee">
                          (+<span className="num">{won(WRAP_FEE)}</span>원)
                        </span>
                      </span>
                      <span className="p4c-wrap-sub">
                        크라프트 상자 + 향 대표 색 리본 <Dot color={card.color} size={12} />
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            )}
          </section>

          {/* P4-S3 결제: 주문자 정보 */}
          <section aria-labelledby="buyer-title" className="p4c-panel">
            <h2 id="buyer-title" className="p4c-panel-title">
              주문자 정보
            </h2>
            <div className="p4c-grid">
              <div className="field">
                <label htmlFor="f-name">주문자 이름</label>
                <input id="f-name" className={errCls(okName)} type="text" value={f.name} onChange={set('name')} autoComplete="name" />
                {tried && !okName && (
                  <p role="alert" className="notice notice-err notice-sm">
                    주문자 이름을 입력해주세요.
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="f-phone">연락처</label>
                <input id="f-phone" className={errCls(okPhone)} type="tel" inputMode="numeric" placeholder="010" value={f.phone} onChange={set('phone')} autoComplete="tel" />
                {tried && !okPhone && (
                  <p role="alert" className="notice notice-err notice-sm">
                    휴대전화 번호를 확인해주세요.
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor="f-pw">주문 비밀번호</label>
                <input id="f-pw" className={errCls(okPw)} type="password" inputMode="numeric" maxLength={4} value={f.pw} onChange={set('pw')} autoComplete="new-password" />
                {tried && !okPw ? (
                  <p role="alert" className="notice notice-err notice-sm">
                    주문 비밀번호는 숫자 4자리로 입력해주세요.
                  </p>
                ) : (
                  <p className="p4c-help">비회원 주문 조회에 쓰여요.</p>
                )}
              </div>
            </div>
          </section>

          {/* P4-S3 결제: 배송지 정보 */}
          <section aria-labelledby="ship-title" className="p4c-panel">
            <h2 id="ship-title" className="p4c-panel-title">
              배송지 정보
            </h2>
            <div className="field p4c-narrow">
              <label htmlFor="f-to">받는 분</label>
              <input id="f-to" className="input" type="text" value={f.to} onChange={set('to')} />
            </div>
            <div className="field">
              <label htmlFor="f-addr">주소</label>
              <div className="p4c-addr">
                <input id="f-addr" className="input" type="text" value={f.addr} onChange={set('addr')} autoComplete="street-address" />
                <button type="button" className="btn-ghost p4c-addr-btn" onClick={() => setAddrOpen(true)}>
                  주소 검색
                </button>
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-detail">상세 주소</label>
              <input id="f-detail" className={errCls(okDetail)} type="text" value={f.detail} onChange={set('detail')} />
              {tried && !okDetail && (
                <p role="alert" className="notice notice-err notice-sm">
                  배송지의 상세 주소를 입력해주세요.
                </p>
              )}
            </div>
            <div className="field p4c-narrow">
              <label htmlFor="f-memo">배송 메모</label>
              <select id="f-memo" className="input" value={f.memo} onChange={set('memo')}>
                <option value="">선택해주세요</option>
                {MEMOS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* P4-S3 결제: 결제 수단 · 동의 */}
          <section aria-labelledby="pay-title" className="p4c-panel">
            <h2 id="pay-title" className="p4c-panel-title">
              결제 수단
            </h2>
            <div role="radiogroup" aria-label="결제 수단" className="p4c-pays">
              {PAYS.map((k) => (
                <label key={k} className={`p4c-pay${f.pay === k ? ' is-on' : ''}`}>
                  <input type="radio" name="pay" checked={f.pay === k} onChange={() => setF((s) => ({ ...s, pay: k }))} />
                  <span>{k}</span>
                </label>
              ))}
            </div>
            <div className="p4c-agrees">
              <label className="check">
                <input type="checkbox" checked={f.agree1} onChange={toggle('agree1')} />
                <span>
                  개인정보 수집·이용 동의 <span className="req">(필수)</span>
                </span>
              </label>
              <label className="check">
                <input type="checkbox" checked={f.agree2} onChange={toggle('agree2')} />
                <span>주문 내용을 확인했으며 결제에 동의합니다</span>
              </label>
              {tried && !okAgree && (
                <p role="alert" className="notice notice-err notice-sm" style={{ marginTop: 4 }}>
                  필수 동의 항목을 확인해주세요.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* 금액 · 결제하기 */}
        <aside aria-label="결제 금액" className="p4-summary p4c-aside">
          <ul className="p4c-items">
            {items.map((x) => (
              <li key={x.id} className="p4c-item">
                <Photo id={x.scent.img} className="p4c-item-thumb" fallback={x.scent.color} label=" " />
                <div className="p4c-item-info">
                  <p className="p4c-item-name">{scentTitle(x.scent)}</p>
                  <p className="p4c-item-sub">
                    {scentNotes(x.scent)} · <span className="num">{x.qty}</span>개
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <dl className="p4c-dl">
            <div>
              <dt>상품 금액</dt>
              <dd>
                <span className="num">{won(goods)}</span>원
              </dd>
            </div>
            <div>
              <dt>선물 포장</dt>
              <dd>
                <span className="num">{won(wrapFee)}</span>원
              </dd>
            </div>
            <div>
              <dt>배송비</dt>
              <dd>무료</dd>
            </div>
            <div className="is-total">
              <dt>최종 결제 금액</dt>
              <dd>
                <span className="num">{won(total)}</span>원
              </dd>
            </div>
          </dl>
          <p className="p4-summary-help p4c-help13">배송비를 포함한 최종 금액을 확인한 뒤 결제해주세요.</p>
          <button type="button" className="btn btn-block" onClick={pay}>
            결제하기
          </button>
        </aside>
      </div>

      {addrOpen && (
        <AddressDialog
          initial={f.addr}
          onClose={() => setAddrOpen(false)}
          onDone={(v) => {
            setF((s) => ({ ...s, addr: v }))
            setAddrOpen(false)
            document.getElementById('f-detail')?.focus()
          }}
        />
      )}
    </div>
    </main>
  )
}
