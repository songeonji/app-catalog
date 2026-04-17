import type { TemplateId, RecommendAnswer } from '../types';

export interface QuestionOption {
  label: string;
  value: number;
  description?: string;
  templates: TemplateId[];
}

export interface Question {
  id: string;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
}

/**
 * Q1. 고객이 앱을 열었을 때 가장 먼저 무엇을 보길 원하시나요?
 */
export const q1: Question = {
  id: 'q1',
  title: '고객이 앱을 열었을 때 가장 먼저 무엇을 보길 원하시나요?',
  options: [
    {
      label: '우리 브랜드 이미지와 이벤트 배너',
      value: 0,
      templates: ['B-1', 'C-1'],
    },
    {
      label: '내 스탬프·쿠폰 등 적립 현황',
      value: 1,
      templates: ['A-1', 'A-2', 'B-2'],
    },
    {
      label: '멤버십 카드나 바코드',
      value: 2,
      templates: ['B-3'],
    },
    {
      label: '바로 주문 유형을 선택하는 화면',
      value: 3,
      templates: ['D-1', 'D-2'],
    },
  ],
};

/**
 * Q2. 앱에서 고객이 주로 어떤 행동을 하길 바라나요?
 * (Q1 응답에 따라 노출되는 선택지가 달라짐 — 기획서 원문)
 * 실제 구현에서는 모든 선택지를 항상 노출하되 가중치로 처리합니다.
 */
export const q2: Question = {
  id: 'q2',
  title: '앱에서 고객이 주로 어떤 행동을 하길 바라나요?',
  options: [
    {
      label: '주문이 핵심, 나머지는 최대한 단순하게',
      value: 0,
      templates: ['B-1', 'C-1'],
    },
    {
      label: '주문과 스탬프 적립, 둘 다 자주 쓰게 하고 싶어요',
      value: 1,
      templates: ['A-1', 'B-2', 'C-2'],
    },
    {
      label: '주문 외에도 다양한 기능을 골고루 활용하게 하고 싶어요',
      value: 2,
      templates: ['A-2', 'C-3', 'C-4'],
    },
  ],
};

/**
 * Q3. 배달과 포장을 모두 운영하시나요?
 */
export const q3: Question = {
  id: 'q3',
  title: '배달과 포장을 모두 운영하시나요?',
  options: [
    {
      label: '아니요, 포장(매장) 주문만 운영해요',
      value: 0,
      templates: [], // Q1·Q2 결과 유지
    },
    {
      label: '네, 배달과 포장을 함께 운영해요',
      value: 1,
      templates: ['D-1', 'D-2'], // Q3-1로 분기
    },
  ],
};

/**
 * Q3-1. 고객이 배달·포장 중 하나를 언제 선택하게 하고 싶으신가요?
 * (Q3에서 "네"를 선택한 경우에만 노출)
 */
export const q3_1: Question = {
  id: 'q3_1',
  title: '고객이 배달·포장 중 하나를 언제 선택하게 하고 싶으신가요?',
  options: [
    {
      label: '앱을 열자마자 첫 화면에서 바로 선택',
      value: 0,
      templates: ['D-1'],
    },
    {
      label: '평소엔 브랜드 화면을 보다가, 주문할 때 선택',
      value: 1,
      templates: ['D-2'],
    },
  ],
};

export const allQuestions = { q1, q2, q3, q3_1 };

/**
 * 추천 로직: 응답 기반 가중치 점수로 시안 순위 산출
 * Q1(3점) > Q2(2점) > Q3-1(2점)
 * Q3에서 "아니요"를 선택하면 Q1·Q2 결과를 유지하고 D 시안 가중치를 낮춤
 */
export function getRecommendedTemplates(answers: RecommendAnswer): TemplateId[] {
  const scores = new Map<TemplateId, number>();

  const allTemplateIds: TemplateId[] = [
    'A-1', 'A-2',
    'B-1', 'B-2', 'B-3',
    'C-1', 'C-2', 'C-3', 'C-4',
    'D-1', 'D-2',
  ];

  for (const id of allTemplateIds) {
    scores.set(id, 0);
  }

  const addScore = (templateIds: TemplateId[], weight: number) => {
    for (const id of templateIds) {
      scores.set(id, (scores.get(id) || 0) + weight);
    }
  };

  // Q1: 가장 높은 가중치 (3점)
  if (answers.q1 !== null) {
    const option = q1.options[answers.q1];
    if (option) addScore(option.templates, 3);
  }

  // Q2: 중간 가중치 (2점)
  if (answers.q2 !== null) {
    const option = q2.options[answers.q2];
    if (option) addScore(option.templates, 2);
  }

  // Q3: 포장만 운영 → D 시안 감점 / 배달+포장 → Q3-1로 분기
  if (answers.q3 === 0) {
    // "아니요, 포장만" → D 시안 제외 (점수 -5로 사실상 제거)
    addScore(['D-1', 'D-2'], -5);
  }

  // Q3-1: 배달·포장 세부 분기 (Q3=1일 때만 적용, 2점)
  if (answers.q3 === 1 && answers.q3_1 !== null) {
    const option = q3_1.options[answers.q3_1];
    if (option) addScore(option.templates, 2);
  }

  return allTemplateIds
    .filter((id) => (scores.get(id) || 0) > 0)
    .sort((a, b) => {
      const diff = (scores.get(b) || 0) - (scores.get(a) || 0);
      if (diff !== 0) return diff;
      return a.localeCompare(b);
    });
}
