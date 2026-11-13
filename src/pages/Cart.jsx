import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Dot from '../components/Dot.jsx'
import Icon from '../components/Icon.jsx'
import Photo from '../components/Photo.jsx'
import Qty from '../components/Qty.jsx'
import { PRICE, getScent, scentNotes, scentTitle, won } from '../data/scents.js'
import { useStore } from '../store/StoreContext.jsx'
import './Cart.css'

// P4-S1 장바구니
export default function Cart() {
  const navigate = useNavigate()
  const { cart, updateCart, removeFromCart, startCheckout } = useStore()
  const [confirm, setConfirm] = useState(null)
  const [err, setErr] = useState(false)

  const rows = cart.map((x) => ({ ...x, scent: getScent(x.id) })).filter((x) => x.scent)
  const selected = rows.filter((x) => x.checked)
  const selCount = selected.reduce((n, x) => n + x.qty, 0)
  const selTotal = selCount * PRICE

  const order = () => {
    if (selCount === 0) {
      setErr(true)
      return
    }
    startCheckout({
      items: selected.map((x) => ({ id: x.id, qty: x.qty })),
      gift: selected.some((x) => x.gift),
      fromCart: true,
    })
    navigate('/checkout')
  }

  return (
    <main>
      <section aria-labelledby="cart-title" className="container p4-section">
        <h1 id="cart-title" className="h1">
          장바구니에 담은 향
        </h1>

        {rows.length === 0 ? (
          <div className="p4-empty on-linen">
            <Photo id="IMG-P4-01" className="p4-empty-img" fallback="linear-gradient(160deg, #F1E3CF 0%, #E0C9AA 100%)" label=" " />
            <div className="p4-empty-text">
              <p className="h3">장바구니가 비어 있어요</p>
              <p>네 가지 질문으로 어울리는 향을 찾거나, 12가지 향을 직접 둘러보세요.</p>
            </div>
            <div className="p4-empty-actions">
              <Link to="/#choose" className="btn">
                <span>내 향 찾기</span>
                <Icon name="right" />
              </Link>
              <Link to="/products" className="btn-ghost">
                향 소개 보기
              </Link>
            </div>
          </div>
        ) : (
          <div className="p4-layout">
            <div className="p4-list">
              {rows.map((x) => {
                const title = scentTitle(x.scent)
                return (
                  <div key={x.id} className="p4-row">
                    <div className="p4-row-main">
                      <label className="p4-check">
                        <input
                          type="checkbox"
                          className="checkbox"
                          checked={x.checked}
                          aria-label={`${title} 선택`}
                          onChange={() => {
                            updateCart(x.id, { checked: !x.checked })
                            setErr(false)
                          }}
                        />
                      </label>
                      <Photo id={x.scent.img} className="p4-thumb" fallback={x.scent.color} label=" " />
                      <div className="p4-row-info">
                        <p className="h4 p4-row-title">
                          <Dot color={x.scent.color} />
                          <span>{title}</span>
                        </p>
                        <p className="p4-row-notes">{scentNotes(x.scent)}</p>
                      </div>
                      <Qty value={x.qty} onChange={(v) => updateCart(x.id, { qty: v })} linen />
                      <p className="price p4-row-price">
                        <span className="num">{won(PRICE * x.qty)}</span>원
                      </p>
                      <button type="button" className="icon-btn p4-del" aria-label={`${title} 삭제`} onClick={() => setConfirm(x.id)}>
                        <Icon name="close" size={18} />
                      </button>
                    </div>
                    {confirm === x.id && (
                      <div role="alertdialog" aria-label="삭제 확인" className="p4-confirm on-linen">
                        <p>이 향을 장바구니에서 삭제할까요?</p>
                        <div className="p4-confirm-actions">
                          <button type="button" className="btn-ghost btn-xs" onClick={() => setConfirm(null)}>
                            취소
                          </button>
                          <button
                            type="button"
                            className="btn btn-xs"
                            onClick={() => {
                              removeFromCart(x.id)
                              setConfirm(null)
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <aside aria-label="주문 합계" className="p4-summary on-linen">
              <div className="p4-summary-rows">
                <div className="p4-summary-row">
                  <span>선택한 상품</span>
                  <span className="p4-summary-count">
                    <span className="num">{selCount}</span>개
                  </span>
                </div>
                <div className="p4-summary-row is-total">
                  <span>상품 금액</span>
                  <span className="p4-summary-total">
                    <span className="num">{won(selTotal)}</span>원
                  </span>
                </div>
              </div>
              <p className="p4-summary-help">주문할 향의 왼쪽 선택란을 눌러주세요.</p>
              {err && selCount === 0 && (
                <p role="alert" className="notice notice-chk notice-sm14">
                  주문할 상품을 하나 이상 선택해주세요.
                </p>
              )}
              <div className="p4-summary-actions">
                <button type="button" className={`btn btn-block${selCount === 0 ? ' is-dim' : ''}`} onClick={order}>
                  <span>주문하기</span>
                  {selCount > 0 && <Icon name="right" />}
                </button>
                <Link to="/products" className="btn-ghost btn-block">
                  계속 둘러보기
                </Link>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}
