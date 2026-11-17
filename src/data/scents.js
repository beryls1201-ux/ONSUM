// 향 12종 (출처: PROJECT_CONTEXT 3-5, 6-2 ③)
// 가을 3종 문구는 문서, 나머지 9종은 Claude 초안 → 사용자 승인 (2026-11-13)

export const PRICE = 39000
export const WRAP_FEE = 3000
export const MAX_QTY = 10

export const SEASONS = ['봄', '여름', '가을', '겨울']
export const TIMES = ['아침', '낮', '밤']

// group: Q4 향의 결 (clear 맑고 가벼운 / bright 꽃·과일처럼 환한 / calm 나무·차처럼 차분한 / cozy 포근하고 달큼한)
export const SCENTS = [
  {
    id: 1, season: '봄', time: '아침', name: '창을 연 아침', notes: ['화이트티', '네롤리'], color: '#E8EDD5', img: 'IMG-SC-01', group: 'clear',
    line: '맑은 아침 공기처럼 가볍게 하루를 열고 싶다면.',
    desc: ['창문을 열자 스며드는 맑은 아침 공기.', '가볍고 산뜻한 분위기를 담았어요.'],
    easy: [['화이트티', '맑고 부드러운 녹차 향'], ['네롤리', '은은하고 깨끗한 오렌지꽃 향']],
  },
  {
    id: 2, season: '봄', time: '낮', name: '꽃병 옆 오후', notes: ['프리지아', '배'], color: '#F2D7D5', img: 'IMG-SC-02', group: 'bright',
    line: '꽃과 과일처럼 환한 분위기를 좋아한다면.',
    desc: ['꽃병 옆으로 부드럽게 드는 오후 햇살.', '환하고 싱그러운 분위기를 담았어요.'],
    easy: [['프리지아', '달콤하고 맑은 꽃 향'], ['배', '시원하고 촉촉한 과일 향']],
  },
  {
    id: 3, season: '봄', time: '밤', name: '산책 끝난 밤', notes: ['라일락', '머스크'], color: '#CFC4DA', img: 'IMG-SC-03', group: 'bright',
    line: '산책 뒤의 포근한 여운을 오래 느끼고 싶다면.',
    desc: ['라일락 향이 남은 산책 끝의 조용한 밤.', '부드럽고 포근한 분위기를 담았어요.'],
    easy: [['라일락', '은은한 보랏빛 꽃 향'], ['머스크', '살결처럼 포근한 향']],
  },
  {
    id: 4, season: '여름', time: '아침', name: '찬물 샤워', notes: ['유자', '민트'], color: '#F3E9B5', img: 'IMG-SC-04', group: 'clear',
    line: '시원하고 상쾌하게 아침을 깨우고 싶다면.',
    desc: ['찬물 샤워로 개운하게 시작하는 여름 아침.', '맑고 상쾌한 분위기를 담았어요.'],
    easy: [['유자', '새콤하고 상큼한 감귤 향'], ['민트', '시원하고 화한 풀잎 향']],
  },
  {
    id: 5, season: '여름', time: '낮', name: '마른 빨래', notes: ['코튼', '린넨'], color: '#D3E2EA', img: 'IMG-SC-05', group: 'clear',
    line: '햇볕에 잘 마른 빨래처럼 깨끗한 분위기를 좋아한다면.',
    desc: ['한낮 햇볕에 보송하게 마른 빨래.', '깨끗하고 가벼운 분위기를 담았어요.'],
    easy: [['코튼', '갓 빨아 말린 면처럼 깨끗한 향'], ['린넨', '햇볕에 말린 천의 보송한 향']],
  },
  {
    id: 6, season: '여름', time: '밤', name: '열어둔 창', notes: ['무화과', '코코넛'], color: '#E6D3B8', img: 'IMG-SC-06', group: 'bright',
    line: '여름밤 바람처럼 부드럽고 달콤한 분위기를 좋아한다면.',
    desc: ['열어둔 창으로 선선한 바람이 드는 여름밤.', '부드럽고 달콤한 분위기를 담았어요.'],
    easy: [['무화과', '은은하게 달콤한 과일 향'], ['코코넛', '부드럽고 고소한 크림 같은 향']],
  },
  {
    id: 7, season: '가을', time: '아침', name: '첫 차 한 잔', notes: ['얼그레이', '베르가못'], color: '#EFCFB0', img: 'IMG-SC-07', group: 'calm',
    line: '따뜻한 차처럼 차분한 분위기를 좋아한다면.',
    desc: ['따뜻한 차 한 잔으로 천천히 여는 아침.', '차분하고 편안한 분위기를 담았어요.'],
    easy: [['얼그레이', '은은한 홍차 향'], ['베르가못', '상큼하고 쌉싸름한 감귤 향']],
  },
  {
    id: 8, season: '가을', time: '낮', name: '길어진 햇살', notes: ['시더우드', '무화과잎'], color: '#D9A066', img: 'IMG-SC-08', group: 'calm',
    line: '나무와 초록 잎의 편안한 분위기를 좋아한다면.',
    desc: ['길게 들어온 오후 햇살 속에 머무는 여유.', '나무와 초록 잎의 편안함을 담았어요.'],
    easy: [['시더우드', '마른 나무 향'], ['무화과잎', '풋풋한 초록 잎 향']],
  },
  {
    id: 9, season: '가을', time: '밤', name: '무드등 독서', notes: ['앰버', '통카빈'], color: '#9C5B3C', img: 'IMG-SC-09', group: 'cozy',
    line: '포근하고 깊은 분위기 속에서 쉬고 싶다면.',
    desc: ['무드등 아래 책장을 넘기는 고요한 밤.', '포근하고 깊은 분위기로 하루를 마무리해요.'],
    easy: [['앰버', '따뜻하고 달큼한 송진 향'], ['통카빈', '바닐라처럼 고소하고 달콤한 향']],
  },
  {
    id: 10, season: '겨울', time: '아침', name: '이불 속 5분', notes: ['화이트머스크', '코튼'], color: '#F4EEE3', img: 'IMG-SC-10', group: 'cozy',
    line: '포근한 이불 속처럼 부드럽게 쉬고 싶다면.',
    desc: ['일어나기 전, 이불 속에서 보내는 5분.', '포근하고 보송한 분위기를 담았어요.'],
    easy: [['화이트머스크', '깨끗하고 포근한 살결 향'], ['코튼', '갓 빨아 말린 면처럼 깨끗한 향']],
  },
  {
    id: 11, season: '겨울', time: '낮', name: '귤 까는 오후', notes: ['시나몬', '오렌지'], color: '#C97B5A', img: 'IMG-SC-11', group: 'calm',
    line: '따뜻하고 상큼한 겨울 오후를 좋아한다면.',
    desc: ['담요 위에서 귤을 까는 느긋한 겨울 오후.', '따뜻하고 상큼한 분위기를 담았어요.'],
    easy: [['시나몬', '따뜻하고 달큼한 계피 향'], ['오렌지', '달콤하고 상큼한 감귤 향']],
  },
  {
    id: 12, season: '겨울', time: '밤', name: '촛불 켠 밤', notes: ['바닐라', '샌달우드'], color: '#5A4034', img: 'IMG-SC-12', group: 'cozy',
    line: '촛불처럼 따뜻하고 깊은 쉼이 필요하다면.',
    desc: ['작은 촛불 하나를 켜고 보내는 고요한 밤.', '달콤하고 깊은 분위기로 하루를 마무리해요.'],
    easy: [['바닐라', '부드럽고 달콤한 향'], ['샌달우드', '크리미하고 따뜻한 나무 향']],
  },
]

export const SEASON_PHOTO = { 봄: 'IMG-SE-01', 여름: 'IMG-SE-02', 가을: 'IMG-SE-03', 겨울: 'IMG-SE-04' }

export function getScent(id) {
  return SCENTS.find((s) => s.id === Number(id)) || null
}

export function scentTitle(s) {
  return `${s.season} ${s.time} · ${s.name}`
}

export function scentNotes(s) {
  return s.notes.join(' · ')
}

// 현재 계절: 3~5월 봄 · 6~8월 여름 · 9~11월 가을 · 12~2월 겨울 (출처: 답변)
export function currentSeason(date = new Date()) {
  const m = date.getMonth() + 1
  if (m >= 3 && m <= 5) return '봄'
  if (m >= 6 && m <= 8) return '여름'
  if (m >= 9 && m <= 11) return '가을'
  return '겨울'
}

export function won(n) {
  return n.toLocaleString('ko-KR')
}
