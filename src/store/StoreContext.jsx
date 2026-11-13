import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { MAX_QTY, PRICE, WRAP_FEE } from '../data/scents.js'

// 장바구니·선물 모드·테스트 여부·모의 주문을 브라우저 localStorage에 보관 (미정 2-1 승인안)
const KEY = 'onsum:v1'

function load() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* 저장소를 쓸 수 없는 환경 */
  }
  return null
}

const initial = {
  cart: [], // { id, qty, checked, gift }
  giftMode: false, // 마지막으로 시작한 테스트가 선물 모드인지
  testSeen: false, // 테스트 결과를 본 적이 있는지 (P3 배너 숨김 기준)
  checkout: null, // { items: [{ id, qty }], gift, fromCart }
  orders: [], // 모의 주문
  lastOrderNo: null,
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(() => ({ ...initial, ...(load() || {}) }))
  const [bump, setBump] = useState(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* 무시 */
    }
  }, [state])

  const addToCart = useCallback((id, qty = 1, gift = false) => {
    setState((s) => {
      const found = s.cart.find((x) => x.id === id)
      const cart = found
        ? s.cart.map((x) => (x.id === id ? { ...x, qty: Math.min(MAX_QTY, x.qty + qty), gift: x.gift || gift } : x))
        : [...s.cart, { id, qty: Math.min(MAX_QTY, qty), checked: true, gift }]
      return { ...s, cart }
    })
    setBump((b) => b + 1)
  }, [])

  const updateCart = useCallback((id, patch) => {
    setState((s) => ({ ...s, cart: s.cart.map((x) => (x.id === id ? { ...x, ...patch } : x)) }))
  }, [])

  const removeFromCart = useCallback((id) => {
    setState((s) => ({ ...s, cart: s.cart.filter((x) => x.id !== id) }))
  }, [])

  const setGiftMode = useCallback((giftMode) => setState((s) => ({ ...s, giftMode })), [])
  const markTestSeen = useCallback(() => setState((s) => ({ ...s, testSeen: true })), [])
  const startCheckout = useCallback((checkout) => setState((s) => ({ ...s, checkout })), [])

  const placeOrder = useCallback((info) => {
    const d = new Date()
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
    const seq = state.orders.filter((o) => o.no.startsWith(`ONS-${ymd}-`)).length + 1
    const orderNo = `ONS-${ymd}-${String(seq).padStart(4, '0')}`
    setState((s) => {
      const co = s.checkout
      if (!co) return s
      const goods = co.items.reduce((sum, it) => sum + PRICE * it.qty, 0)
      const wrapFee = info.gift && info.wrap ? WRAP_FEE : 0
      const order = {
        no: orderNo,
        password: info.password,
        items: co.items,
        goods,
        wrap: info.gift && info.wrap,
        wrapFee,
        total: goods + wrapFee,
        status: '결제 완료',
        shipping: '출고 전 · 운송장 등록 전',
        createdAt: d.toISOString(),
      }
      const ordered = new Set(co.items.map((i) => i.id))
      const cart = co.fromCart ? s.cart.filter((x) => !(x.checked && ordered.has(x.id))) : s.cart
      return { ...s, orders: [...s.orders, order], lastOrderNo: orderNo, checkout: null, cart }
    })
    return orderNo
  }, [state.orders])

  const findOrder = useCallback(
    (no, password) => state.orders.find((o) => o.no === no.trim().toUpperCase() && o.password === password.trim()) || null,
    [state.orders],
  )

  const cartCount = state.cart.reduce((n, x) => n + x.qty, 0)

  const value = useMemo(
    () => ({
      ...state,
      cartCount,
      bump,
      addToCart,
      updateCart,
      removeFromCart,
      setGiftMode,
      markTestSeen,
      startCheckout,
      placeOrder,
      findOrder,
    }),
    [state, cartCount, bump, addToCart, updateCart, removeFromCart, setGiftMode, markTestSeen, startCheckout, placeOrder, findOrder],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useStore() {
  return useContext(StoreContext)
}
