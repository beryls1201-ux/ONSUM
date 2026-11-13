import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { logo } from '../data/images.js'

// C-TGNB 테스트 헤더 (P2에서만): ← 이전 · 로고 · 닫기 ✕
export default function TestHeader({ onBack }) {
  return (
    <header className="gnb">
      <div className="tgnb-inner">
        <div>
          <button type="button" className="tgnb-back" onClick={onBack}>
            <Icon name="left" size={20} />
            <span>이전</span>
          </button>
        </div>
        <Link to="/" aria-label="온숨 메인으로" className="gnb-logo">
          <img src={logo} alt="onsum" />
        </Link>
        <div className="tgnb-right">
          <Link to="/" className="tgnb-close" aria-label="테스트 닫기 (답변은 저장되지 않아요)">
            <Icon name="close" size={18} />
          </Link>
        </div>
      </div>
    </header>
  )
}
