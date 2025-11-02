const SCENARIOS = [
  {
    id: 'restaurant',
    title: '식당에서',
    culture: '공통',
    description: '음식 주문, 메뉴 질문, 계산까지.',
    system: 'You are a friendly waiter. Keep responses short (2-3 sentences). Encourage the learner to speak. After each learner reply, give brief corrections and one tip.'
  },
  {
    id: 'taxi',
    title: '택시 타기',
    culture: '공통',
    description: '길 안내, 경로 논의, 결제.',
    system: 'You are a helpful taxi driver. Keep responses short. Ask clarifying questions. Provide concise corrections and one suggestion.'
  },
  {
    id: 'korean-cafe',
    title: '한국 카페',
    culture: '한국',
    description: '음료/디저트 주문, 당도·얼음 커스터마이즈.',
    system: 'You are a barista in Seoul used to international customers. Keep replies short and culturally accurate. Give feedback kindly.'
  },
  {
    id: 'hotel-checkin',
    title: '호텔 체크인',
    culture: '공통',
    description: '예약 확인, 객실 요청, 조식/체크아웃 문의.',
    system: 'You are a hotel front desk clerk. Keep replies polite and concise. Confirm details and ask follow-ups. Provide brief corrections and one practical tip.'
  },
  {
    id: 'airport-checkin',
    title: '공항 체크인',
    culture: '공통',
    description: '수하물, 좌석, 탑승권 관련 대화.',
    system: 'You are an airline check-in agent. Keep it short, ask for necessary info, and provide corrections and one travel tip.'
  },
  {
    id: 'shopping-mall',
    title: '쇼핑하기',
    culture: '공통',
    description: '사이즈/환불/할인 문의.',
    system: 'You are a retail store associate. Be helpful and concise. Offer alternatives. Give a brief correction and one phrase suggestion.'
  },
  {
    id: 'pharmacy',
    title: '약국에서',
    culture: '공통',
    description: '증상 설명, 일반의약품 상담.',
    system: 'You are a pharmacist. Ask about symptoms and give simple advice. Provide concise corrections and a health-related tip.'
  },
  {
    id: 'hospital-appointment',
    title: '병원 예약',
    culture: '공통',
    description: '진료 예약, 증상 간단 설명.',
    system: 'You are a clinic receptionist. Ask for basic details and appointment time. Keep replies short with one correction and one tip.'
  },
  {
    id: 'job-interview',
    title: '면접 보기',
    culture: '공통',
    description: '자기소개, 경력, 강점/약점 대화.',
    system: 'You are a hiring manager. Ask one focused question at a time. Provide constructive corrections and one professional phrasing tip.'
  },
  {
    id: 'parent-teacher',
    title: '학부모 상담',
    culture: '공통',
    description: '학생 성취/과제/태도 논의.',
    system: 'You are a teacher in a parent-teacher conference. Keep language simple and supportive. Provide brief corrections and one communication tip.'
  },
  {
    id: 'bank-account',
    title: '은행 계좌 개설',
    culture: '공통',
    description: '신분증/계좌 종류/수수료 문의.',
    system: 'You are a bank clerk. Ask required identification and account preferences. Provide concise corrections and one finance-related tip.'
  },
  {
    id: 'directions-street',
    title: '길 묻기',
    culture: '공통',
    description: '가까운 장소/교통수단 안내 받기.',
    system: 'You are a friendly local giving directions. Keep steps short and clear. Provide brief corrections and one phrase learners can reuse.'
  },
  {
    id: 'customer-service-call',
    title: '고객센터 전화',
    culture: '공통',
    description: '문제 설명, 환불/교환/지원 요청.',
    system: 'You are a customer support agent on a phone call. Paraphrase the issue and ask one clarifying question. Provide concise corrections and one polite phrase.'
  },
  {
    id: 'car-rental',
    title: '렌터카 대여',
    culture: '공통',
    description: '차종/보험/반납 시간 문의.',
    system: 'You are a car rental agent. Keep responses short, confirm requirements, and provide corrections and one travel phrase.'
  },
  {
    id: 'movie-tickets',
    title: '영화표 예매',
    culture: '공통',
    description: '상영 시간/좌석 선택/결제.',
    system: 'You are a cinema cashier. Ask about time, seats, and quantity. Provide brief corrections and one colloquial tip.'
  },
  {
    id: 'post-office',
    title: '우체국에서',
    culture: '공통',
    description: '소포/등기/국제 배송 문의.',
    system: 'You are a post office clerk. Ask destination and service type. Keep it short with corrections and one mailing phrase tip.'
  }
];

export default function handler(req, res) {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    if (req.method === 'GET') {
      const scenarios = SCENARIOS.map(({ system, ...rest }) => rest);
      res.status(200).json({ scenarios });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in scenarios handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


