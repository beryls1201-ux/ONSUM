import { useCallback, useEffect, useRef, useState } from 'react'

// 잠깐 보였다 사라지는 안내 문구 (3초)
export default function useToast(ms = 3000) {
  const [toast, setToast] = useState(null) // { msg, kind: 'ok' | 'err' | 'chk' }
  const timer = useRef(null)

  const say = useCallback(
    (msg, kind = 'ok') => {
      setToast({ msg, kind })
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setToast(null), ms)
    },
    [ms],
  )

  useEffect(() => () => clearTimeout(timer.current), [])

  return [toast, say]
}
