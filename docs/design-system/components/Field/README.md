# Field

결제·문의·주문 조회 화면의 입력 요소예요. 폼은 리넨 패널(모서리 24, 안쪽 32) 안에 둬요.

- **입력칸·선택 상자**: 높이 52, 모서리 8, `surface-cream` 바탕 + `line-strong` 1px 테두리, 16px. 라벨은 칸 위 14px 500(placeholder로 라벨을 대신하지 않음).
- **상태**: 입력 중 `sage-deep` 테두리 + `shadow-focus` / 오류 `apricot` 2px 테두리 + `shadow-error` + 칸 바로 아래 오류 안내 띠(Message 참고). 오류는 '결제하기'를 누른 뒤에만 보여줘요.
- **체크·라디오**: 20px, `accent-color: sage-deep`, 줄 전체가 클릭 영역(높이 44 이상). 필수 표시는 "(필수)"를 `sage-deep` 700으로.
- **토글**: 56×32 알약, 켜짐 `sage-deep` / 꺼짐 `check-line`, 손잡이 크림. `role="switch"`.
- **수량**: 크림 알약 안에 − 숫자 + (버튼 40). 최소 1, 최대는 미정.
- **결제 수단**: 크림 상자(높이 56, 모서리 16) 3개, 고른 것에 `sage-deep` 2px 테두리.
