import { useCallback, useEffect, useRef, useState } from 'react'

// 담기 버튼을 누른 뒤 잠깐(1.5초) '담았어요' 상태로 바꿔 클릭했음을 보여줌
export default function useAdded(ms = 1500) {
  const [added, setAdded] = useState(false)
  const t = useRef(null)
  const flash = useCallback(() => {
    setAdded(true)
    clearTimeout(t.current)
    t.current = setTimeout(() => setAdded(false), ms)
  }, [ms])
  useEffect(() => () => clearTimeout(t.current), [])
  return [added, flash]
}
