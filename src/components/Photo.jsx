import { img } from '../data/images.js'

// 이미지 ID로 사진을 보여준다. 파일이 없으면 시안처럼 웜톤 면 + ID 라벨 자리 표시
export default function Photo({ id, alt = '', className = '', style, fallback = '#E4D2B8', label, children }) {
  const src = img(id)
  return (
    <div className={`photo ${className}`} style={{ background: fallback, ...style }}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <span className="photo-placeholder">{label || id}</span>
      )}
      {children}
    </div>
  )
}
