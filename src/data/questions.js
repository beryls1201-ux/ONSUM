import { SCENTS, currentSeason } from './scents.js'

// 테스트 질문 (출처: PROJECT_CONTEXT 3-5, docs/html P2-S1)
// 선물 모드 문장: Q1은 문서 예시, Q2~Q4는 Claude 초안 → 승인 (2026-11-13)
export const QUESTIONS = [
  {
    title: '하루를 마치고 방에 들어서면,\n가장 먼저 무엇을 하고 싶나요?',
    giftTitle: '그 사람은 하루를 마치고 방에 들어서면,\n가장 먼저 무엇을 하고 싶어 할까요?',
    guide: '네 가지 장면 중 가장 끌리는 하나를 선택한 뒤 ‘다음 질문’을 눌러주세요.',
    kind: 'season',
    points: 2,
    options: [
      { label: '창문을 연다', img: 'IMG-Q1-1', value: '여름', bg: '#D3DCD8' },
      { label: '꽃이나 화분을 본다', img: 'IMG-Q1-2', value: '봄', bg: '#E2CFC6' },
      { label: '따뜻한 차를 끓인다', img: 'IMG-Q1-3', value: '가을', bg: '#D9BE9A' },
      { label: '이불 속으로 들어간다', img: 'IMG-Q1-4', value: '겨울', bg: '#DCD3C6' },
    ],
  },
  {
    title: '내 방이 가장 좋은 시간은',
    giftTitle: '그 사람의 방이 가장 좋은 시간은',
    guide: '세 가지 장면 중 가장 끌리는 하나를 선택한 뒤 ‘다음 질문’을 눌러주세요.',
    kind: 'time',
    points: 3,
    options: [
      { label: '출근 전 아침', img: 'IMG-Q2-1', value: '아침', bg: '#E6D9BE' },
      { label: '쉬는 날 낮', img: 'IMG-Q2-2', value: '낮', bg: '#D6C79F' },
      { label: '잠들기 전 밤', img: 'IMG-Q2-3', value: '밤', bg: '#9C8670' },
    ],
  },
  {
    title: '창밖으로 보고 싶은 풍경은',
    giftTitle: '그 사람이 창밖으로 보고 싶어 할 풍경은',
    guide: '네 가지 장면 중 가장 끌리는 하나를 선택한 뒤 ‘다음 질문’을 눌러주세요.',
    kind: 'season',
    points: 2,
    options: [
      { label: '꽃이 핀 길', img: 'IMG-Q3-1', value: '봄', bg: '#E3CCC8' },
      { label: '소나기 지나간 거리', img: 'IMG-Q3-2', value: '여름', bg: '#BFCACB' },
      { label: '단풍 든 산책로', img: 'IMG-Q3-3', value: '가을', bg: '#CFA27A' },
      { label: '눈 내리는 밤', img: 'IMG-Q3-4', value: '겨울', bg: '#A8A6AE' },
    ],
  },
  {
    title: '끌리는 향의 느낌은',
    giftTitle: '그 사람이 끌릴 향의 느낌은',
    guide: '네 가지 장면 중 가장 끌리는 하나를 선택한 뒤 ‘추천 향 보기’를 눌러주세요.',
    kind: 'group',
    points: 3,
    options: [
      { label: '맑고 가벼운', img: 'IMG-Q4-1', value: 'clear', bg: '#D9E1DA' },
      { label: '꽃·과일처럼 환한', img: 'IMG-Q4-2', value: 'bright', bg: '#E9CDBF' },
      { label: '나무·차처럼 차분한', img: 'IMG-Q4-3', value: 'calm', bg: '#C9AE8A' },
      { label: '포근하고 달큰한', img: 'IMG-Q4-4', value: 'cozy', bg: '#D8BFA8' },
    ],
  },
]

// 답 배열 [q1, q2, q3, q4] (선택지 번호) ↔ 링크 문자열 "2031"
export function encodeAnswers(answers) {
  return answers.join('')
}

export function decodeAnswers(str) {
  if (!str || str.length !== 4) return null
  const a = str.split('').map((c) => Number(c))
  const ok = a.every((v, i) => Number.isInteger(v) && v >= 0 && v < QUESTIONS[i].options.length)
  return ok ? a : null
}

// 점수 계산 (출처: PROJECT_CONTEXT 3-5)
// 동점: 향의 결 점수 → 시간대 점수 → 계절 점수 → 현재 계절의 향을 앞에
export function rankScents(answers, now = new Date()) {
  const pick = answers.map((v, i) => QUESTIONS[i].options[v].value)
  const [s1, time, s3, group] = pick
  const nowSeason = currentSeason(now)
  const scored = SCENTS.map((s) => {
    const seasonPts = (s.season === s1 ? 2 : 0) + (s.season === s3 ? 2 : 0)
    const timePts = s.time === time ? 3 : 0
    const groupPts = s.group === group ? 3 : 0
    return { scent: s, total: seasonPts + timePts + groupPts, seasonPts, timePts, groupPts }
  })
  scored.sort(
    (a, b) =>
      b.total - a.total ||
      b.groupPts - a.groupPts ||
      b.timePts - a.timePts ||
      b.seasonPts - a.seasonPts ||
      (b.scent.season === nowSeason) - (a.scent.season === nowSeason) ||
      a.scent.id - b.scent.id,
  )
  return scored.slice(0, 3).map((x) => x.scent)
}

// 요약 블록 (출처: PROJECT_CONTEXT 3-5, 미정 2-5 승인안)
// 계절: Q1·Q3이 같으면 그 계절, 다르면 1위 향의 계절
export function summarize(answers, top) {
  const o = answers.map((v, i) => QUESTIONS[i].options[v])
  const season = o[0].value === o[2].value ? o[0].value : top.season
  return {
    season,
    seasonPicks: [o[0].label, o[2].label],
    time: o[1].value,
    timePick: o[1].label,
    feel: o[3].label,
  }
}
