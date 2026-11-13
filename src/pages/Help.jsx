import { useState } from 'react'
import { Link } from 'react-router-dom'
import Dot from '../components/Dot.jsx'
import Icon from '../components/Icon.jsx'
import { getScent, scentTitle, won } from '../data/scents.js'
import { useStore } from '../store/StoreContext.jsx'
import './Help.css'

const FAQS = [
  [
    '주문과 배송 현황은 어디서 확인하나요?',
    '화면 하단의 ‘비회원 주문 조회’에서 주문번호와 주문 시 설정한 비밀번호를 입력해주세요.\n결제·출고 상태를 확인할 수 있으며, 운송장이 등록되면 배송 정보를 확인할 수 있어요.\n주문번호를 찾기 어렵거나 배송 일정이 궁금하다면 아래 문의 양식에 내용을 남겨주세요.',
  ],
  [
    '교환·반품은 어떻게 신청하나요?',
    '아래 문의 양식에서 ‘교환·반품’을 선택하고 주문번호, 상품명, 신청 사유를 남겨주세요.\n개봉·사용 여부와 상품 상태를 함께 알려주시면 신청 내용을 확인하는 데 도움이 됩니다.\n교환·반품 가능 여부와 절차, 비용은 상품 상태와 사유를 확인한 뒤 안내해드려요.',
  ],
  [
    '상품이 파손되거나 다른 상품이 왔어요.',
    '받으신 상품과 포장 상태를 확인하고, 확인에 필요한 사진을 보관해주세요.\n문의 유형에서 ‘교환·반품’을 선택한 뒤 주문번호와 수령한 상품명, 파손·오배송 내용을 남겨주세요.\n접수 내용을 확인한 뒤 필요한 후속 절차를 안내해드려요.',
  ],
  [
    '선물 메시지 카드와 포장은 어떻게 선택하나요?',
    '주문 단계에서 ‘선물로 보내기’를 켜고, 전하고 싶은 메시지를 최대 100자까지 입력해주세요.\n향의 이름·주요 노트·장면을 담은 메시지 카드는 무료예요.\n크라프트 상자와 향의 대표 색 리본 포장을 원하면 ‘선물 포장 추가’를 선택해주세요. 포장비는 3,000원이에요.',
  ],
]

const TYPES = ['상품·향 추천', '주문·결제', '배송', '교환·반품', '선물 옵션']

const INQ_MSG = {
  missing: ['err', '문의 유형, 이름, 답변받을 연락처와 문의 내용을 입력해주세요.'],
  agree: ['err', '필수 동의 항목을 확인해주세요.'],
  ok: ['ok', '문의가 접수되었어요. 남겨주신 연락처로 답변드릴게요.'],
}

// P6 고객 안내
export default function Help() {
  const { findOrder } = useStore()
  const [open, setOpen] = useState(0)
  const [q, setQ] = useState({ type: '', name: '', contact: '', order: '', body: '', agree: false })
  const [inq, setInq] = useState('')
  const [look, setLook] = useState({ no: '', pw: '' })
  const [lookState, setLookState] = useState('') // '' | empty | fail | found
  const [found, setFound] = useState(null)

  const setQField = (k) => (e) => setQ((s) => ({ ...s, [k]: e.target.value }))

  const send = () => {
    const ok = q.type && q.name.trim() && q.contact.trim() && q.body.trim()
    if (!ok) return setInq('missing')
    if (!q.agree) return setInq('agree')
    // 모의 동작: 서버로 보내지 않고 접수 안내만
    setInq('ok')
    setQ({ type: '', name: '', contact: '', order: '', body: '', agree: false })
  }

  const lookup = () => {
    if (!look.no.trim() || !look.pw.trim()) {
      setLookState('empty')
      setFound(null)
      return
    }
    const o = findOrder(look.no, look.pw)
    setFound(o)
    setLookState(o ? 'found' : 'fail')
  }

  return (
    <main>
      {/* P6-S1 배송·교환 안내 */}
      <section id="faq" aria-labelledby="faq-title" className="container p6-faq">
        <h1 id="faq-title" className="h1">
          배송과 교환, 궁금하신가요?
        </h1>
        <div className="p6-faq-list">
          {FAQS.map(([qq, a], i) => {
            const on = open === i
            return (
              <div key={qq} className="p6-faq-item">
                <h2 className="p6-faq-h">
                  <button type="button" aria-expanded={on} className="p6-faq-q" onClick={() => setOpen(on ? -1 : i)}>
                    <span className="p6-faq-q-text">
                      <span aria-hidden="true" className="num p6-faq-mark">
                        Q
                      </span>
                      <span>{qq}</span>
                    </span>
                    <Icon name="chevUp" size={20} className={`p6-chev${on ? '' : ' is-closed'}`} />
                  </button>
                </h2>
                {/* 답이 부드럽게 펼쳐지고 접힘. 접혀 있을 때는 inert로 읽기·포커스 제외 */}
                <div className={`collapse${on ? ' is-open' : ''}`} inert={!on}>
                  <div className="collapse-inner">
                    <p className="p6-faq-a">{a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* P6-S2 문의 */}
      <section id="inquiry" aria-labelledby="inq-title" className="container p6-block">
        <div className="head-group">
          <h2 id="inq-title" className="h2">
            온숨에 문의하기
          </h2>
          <p className="lead">
            상품·향 추천, 주문·결제, 배송, 교환·반품, 선물 옵션 중 문의 유형을 선택해주세요.
            <br />
            답변받을 연락처나 이메일을 적고, 주문 관련 문의라면 주문번호를 함께 남겨주세요.
          </p>
        </div>
        <div className="p6-panel">
          <div className="p6-grid">
            <div className="field">
              <label htmlFor="q-type">문의 유형</label>
              <select id="q-type" className="input" value={q.type} onChange={setQField('type')}>
                <option value="">선택해주세요</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="q-name">이름</label>
              <input id="q-name" className="input" type="text" value={q.name} onChange={setQField('name')} autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="q-contact">연락처 또는 이메일</label>
              <input id="q-contact" className="input" type="text" value={q.contact} onChange={setQField('contact')} />
            </div>
            <div className="field">
              <label htmlFor="q-order">
                주문번호 <span className="p6-optional">(선택)</span>
              </label>
              <input id="q-order" className="input" type="text" placeholder="ONS-" value={q.order} onChange={setQField('order')} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="q-body">문의 내용</label>
            <textarea id="q-body" className="input p6-textarea" rows={5} value={q.body} onChange={setQField('body')} />
          </div>
          <div className="p6-send-row">
            <label className="check">
              <input type="checkbox" checked={q.agree} onChange={() => setQ((s) => ({ ...s, agree: !s.agree }))} />
              <span>
                개인정보 수집·이용 동의 <span className="req">(필수)</span>
              </span>
            </label>
            <button type="button" className="btn p6-send" onClick={send}>
              문의 보내기
            </button>
          </div>
          <p role="status" className={inq ? `notice notice-${INQ_MSG[inq][0]}` : 'p6-status-empty'}>
            {inq ? INQ_MSG[inq][1] : ''}
          </p>
        </div>
      </section>

      {/* P6-S3 비회원 주문 조회 */}
      <section id="lookup" aria-labelledby="look-title" className="container p6-block p6-last">
        <div className="head-group">
          <h2 id="look-title" className="h2">
            비회원 주문 조회
          </h2>
          <p className="lead">
            주문 완료 화면의 주문번호와 주문 시 설정한 비밀번호를 입력해주세요.
            <br />
            주문번호를 찾을 수 없다면 위 문의 양식으로 주문자 이름과 연락처를 알려주세요.
          </p>
        </div>
        <div className="p6-panel">
          <div className="p6-look-row">
            <div className="field p6-look-field">
              <label htmlFor="l-no">주문번호</label>
              <input id="l-no" className="input" type="text" placeholder="ONS-20261113-0001" value={look.no} onChange={(e) => setLook((s) => ({ ...s, no: e.target.value }))} />
            </div>
            <div className="field p6-look-field">
              <label htmlFor="l-pw">주문 비밀번호</label>
              <input id="l-pw" className="input" type="password" inputMode="numeric" value={look.pw} onChange={(e) => setLook((s) => ({ ...s, pw: e.target.value }))} />
            </div>
            <button type="button" className="btn p6-look-btn" onClick={lookup}>
              조회하기
            </button>
          </div>
          {(lookState === 'empty' || lookState === 'fail') && (
            <p role="alert" className="notice notice-err">
              {lookState === 'empty' ? '주문번호와 주문 비밀번호를 모두 입력해주세요.' : '일치하는 주문을 찾지 못했어요. 주문번호와 비밀번호를 다시 확인해주세요.'}
            </p>
          )}
          {lookState === 'found' && found && (
            <dl className="p6-result">
              <div>
                <dt>주문번호</dt>
                <dd className="num p6-result-no">{found.no}</dd>
              </div>
              <div>
                <dt>주문 상품</dt>
                <dd className="p6-result-items">
                  {found.items.map((it) => {
                    const s = getScent(it.id)
                    return (
                      <span key={it.id} className="p6-result-item">
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
                  <span className="num">{won(found.goods)}</span>원
                </dd>
              </div>
              <div>
                <dt>선물 포장</dt>
                <dd>{found.wrap ? '선택' : '선택 안 함'}</dd>
              </div>
              <div>
                <dt>주문 상태</dt>
                <dd>
                  <span className="p6-status">{found.status}</span>
                </dd>
              </div>
              <div>
                <dt>배송 정보</dt>
                <dd>{found.shipping}</dd>
              </div>
            </dl>
          )}
        </div>
        <div>
          <Link to="/" className="btn-ghost">
            메인으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  )
}
