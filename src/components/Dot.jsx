// 향 대표 색 원 (대표 색은 작은 원·메시지 카드 띠·포장 리본에만)
export default function Dot({ color, size = 14, title }) {
  return <span className="dot" aria-hidden={title ? undefined : 'true'} title={title} style={{ width: size, height: size, background: color }} />
}
