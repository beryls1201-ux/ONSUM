import { Link, Navigate } from 'react-router-dom'
import Dot from '../components/Dot.jsx'
import Photo from '../components/Photo.jsx'
import { getScent, scentTitle, won } from '../data/scents.js'
import { useStore } from '../store/StoreContext.jsx'
import './Complete.css'

// P4-S4 주문 완료
export default function Complete() {
  const { orders, lastOrderNo } = useStore()
  const order = orders.find((o) => o.no === lastOrderNo)
  if (!order) return <Navigate to="/" replace />

  return (
    <main>
      <div className="container p4d-main">
      <section aria-labelledby="done-title" className="p4d-section">
        <div className="p4d-head">
          <Photo id="IMG-P4-03" className="p4d-img" fallback="linear-gradient(160deg, #F1E3CF 0%, #E0C9AA 100%)" label=" " />
          <h1 id="done-title" className="h1">
            주문이 완료되었어요
          </h1>
          <p className="lead">
            온숨을 선택해주셔서 감사합니다.
            <br />
            아래 주문번호를 보관해주세요. 주문 시 설정한 비밀번호와 함께 주문·배송 상태를 조회할 수 있어요.
          </p>
        </div>

        <div className="p4d-box">
          <dl className="p4d-dl">
            <div>
              <dt>주문번호</dt>
              <dd className="num p4d-no">{order.no}</dd>
            </div>
            <div>
              <dt>주문 상품 · 수량</dt>
              <dd className="p4d-items">
                {order.items.map((it) => {
                  const s = getScent(it.id)
                  return (
                    <span key={it.id} className="p4d-item">
                      <Dot color={s.color} size={12} />
                      {scentTitle(s)} × <span className="num">{it.qty}</span>
                    </span>
                  )
                })}
              </dd>
            </div>
            <div>
              <dt>상품 금액</dt>
              <dd>
                <span className="num">{won(order.goods)}</span>원
              </dd>
            </div>
            <div>
              <dt>선물 포장</dt>
              <dd>
                {order.wrap ? (
                  <>
                    선택 (<span className="num">{won(order.wrapFee)}</span>원)
                  </>
                ) : (
                  '선택 안 함'
                )}
              </dd>
            </div>
            <div>
              <dt>배송비 · 총 결제 금액</dt>
              <dd>
                무료 ·{' '}
                <strong className="p4d-total">
                  <span className="num">{won(order.total)}</span>원
                </strong>
              </dd>
            </div>
            <div className="is-center">
              <dt>주문 상태</dt>
              <dd>
                <span className="p4d-status">{order.status}</span>
              </dd>
            </div>
          </dl>
        </div>

        <Link to="/" className="btn">
          메인으로 돌아가기
        </Link>
      </section>
    </div>
    </main>
  )
}
