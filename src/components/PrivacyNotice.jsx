import './PrivacyNotice.css'

// 개인정보 수집·이용 동의 전문 (포트폴리오용 예시). '내용 보기'를 누르면 펼쳐짐
// 실제 운영 전에는 전문가 확인을 받아 바꿔야 함 (PROJECT_CONTEXT 2-15)
const TEXT = {
  order: {
    items: '주문자 이름, 연락처, 주문 비밀번호, 받는 분, 배송지 주소',
    purpose: '주문 확인, 상품 배송, 비회원 주문 조회',
    period: '주문 처리가 끝나면 바로 파기해요. 관계 법령에 따라 보관해야 하는 정보는 그 기간 동안만 보관해요.',
    refuse: '동의하지 않을 수 있지만, 동의하지 않으면 주문할 수 없어요.',
    store: '입력한 정보는 서버로 보내지 않고 이 브라우저에만 저장돼요.',
  },
  inquiry: {
    items: '이름, 연락처 또는 이메일, 주문번호(선택), 문의 내용',
    purpose: '문의 확인과 답변',
    period: '답변이 끝나면 바로 파기해요. 관계 법령에 따라 보관해야 하는 정보는 그 기간 동안만 보관해요.',
    refuse: '동의하지 않을 수 있지만, 동의하지 않으면 문의를 보낼 수 없어요.',
    store: '입력한 정보는 서버로 보내거나 저장하지 않아요.',
  },
}

export default function PrivacyNotice({ type = 'order' }) {
  const t = TEXT[type]
  return (
    <details className="privacy">
      <summary className="privacy-summary">개인정보 수집·이용 내용 보기</summary>
      <dl className="privacy-body">
        <div>
          <dt>수집 항목</dt>
          <dd>{t.items}</dd>
        </div>
        <div>
          <dt>이용 목적</dt>
          <dd>{t.purpose}</dd>
        </div>
        <div>
          <dt>보유 기간</dt>
          <dd>{t.period}</dd>
        </div>
        <div>
          <dt>동의 거부</dt>
          <dd>{t.refuse}</dd>
        </div>
      </dl>
      <p className="privacy-note">온숨은 포트폴리오용 예시 사이트예요. {t.store}</p>
    </details>
  )
}
