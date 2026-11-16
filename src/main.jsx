import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './components/layout.css'
import App from './App.jsx'
import { StoreProvider } from './store/StoreContext.jsx'
// 모바일·태블릿(터치 기기) 전용 인터랙션 조정 — 다른 CSS보다 나중에 불러와야 덮어쓸 수 있음 (docs/interaction.md)
import './mobile-interaction.css'
// 태블릿·모바일 전용 정렬 조정 (푸터·진행 칩·버튼 묶음 가운데) — docs/interaction.md 6장
import './mobile-align.css'
// 태블릿·모바일 햄버거 메뉴 — docs/interaction.md 7장
import './mobile-nav.css'
// 태블릿·모바일 배치·글자 크기 (첫 화면, 제목 크기, 테스트 선택지 2열) — docs/interaction.md 8장
import './mobile-layout.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
