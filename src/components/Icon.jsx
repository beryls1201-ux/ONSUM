// 인라인 선 아이콘: 24 격자, stroke 1.8, 둥근 끝, currentColor (출처: 디자인 시스템 '아이콘')
const PATHS = {
  right: ['M5 12h14', 'M13 6l6 6-6 6'],
  down: ['M12 5v14', 'M6 13l6 6 6-6'],
  left: ['M19 12H5', 'M11 6l-6 6 6 6'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  link: ['M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1', 'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'],
  retry: ['M4 12a8 8 0 1 0 2.4-5.7', 'M4 4v4.5h4.5'],
  chevUp: ['M6 15l6-6 6 6'],
}

export default function Icon({ name, size = 18, stroke = 1.8, className, style }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
