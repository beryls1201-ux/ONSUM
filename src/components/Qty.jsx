import Icon from './Icon.jsx'
import { MAX_QTY } from '../data/scents.js'

export default function Qty({ value, onChange, linen = false }) {
  return (
    <div className={`qty ${linen ? 'qty-linen' : ''}`}>
      <button type="button" className="icon-btn" aria-label="수량 줄이기" onClick={() => value > 1 && onChange(value - 1)}>
        <Icon name="minus" size={16} stroke={2} />
      </button>
      <span className="qty-value" aria-live="polite">
        {value}
      </span>
      <button type="button" className="icon-btn" aria-label="수량 늘리기" onClick={() => value < MAX_QTY && onChange(value + 1)}>
        <Icon name="plus" size={16} stroke={2} />
      </button>
    </div>
  )
}
