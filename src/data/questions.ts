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
 * Q1. 주로 어떤 상권에 위치해 있나요?
 * 상권이 고객의 체류 시간과 앱 사용 패턴을 결정합니다.
 * Q1 = 로드샵·외곽(value 3) 선택 시 Q2 스킵 → Q3로 바로 이동
 */
export const q1: Question = {
  id: 'q1',
  title: '주로 어떤 상권에 위치해 있나요?',
  options: [
    {
      label: '오피스·직장가',
      value: 0,
      description: '점심·퇴근 시간 집중, 빠른 재주문 중요',
      templates: ['B-1', 'C-1', 'C-2'],
    },
    {
      label: '주거·골목상권',
      value: 1,
      description: '단골 비율 높음, 적립·멤버십 활용도 높음',
      templates: ['A-1', 'B-2', 'B-3'],
    },
    {
      label: '쇼핑몰·번화가',
      value: 2,
      description: '신규 고객 비율 높음, 이벤트·브랜드 노출 중요',
      templates: ['A-2', 'C-3', 'C-4'],
    },
    {
      label: '로드샵·외곽',
      value: 3,
      description: '배달·포장 비율 높음, 주문 유형 구분 필요',
      templates: ['D-1', 'D-2'],
    },
  ],
};

/**
 * Q2. 주 고객층은 누구인가요?
 * (Q1 = 로드샵·외곽 선택 시 스킵)
 */
export const q2: Question = {
  id: 'q2',
  title: '주 고객층은 누구인가요?',
  options: [
    {
      label: '직장인 (30~40대)',
      value: 0,
      description: '빠른 주문·재주문, 기능 단순 선호',
      templates: ['B-1', 'B-2', 'C-2'],
    },
    {
      label: 'MZ세대 (20~30대)',
      value: 1,
      description: '스탬프·쿠폰 등 혜택에 민감, 이벤트 참여 활발',
      templates: ['A-2', 'C-3', 'C-4'],
    },
    {
      label: '가족·중장년 (40대 이상)',
      value: 2,
      description: '단순한 구성, 멤버십 카드·바코드 선호',
      templates: ['B-3', 'C-1'],
    },
    {
      label: '특정 타겟 없음',
      value: 3,
      description: '범용 구성',
      templates: ['A-1', 'B-1'],
    },
  ],
};

/**
 * Q3. 배달 서비스를 운영하시나요?
 * - 아니요: Q1·Q2 교집합 결과 유지, D계열 제외
 * - 예: Q1·Q2 결과 무관하게 D계열로 강제 → Q3-1 분기
 */
export const q3: Question = {
  id: 'q3',
  title: '배달 서비스를 운영하시나요?',
  options: [
    {
      label: '아니요, 포장(매장) 주문만 운영해요',
      value: 0,
      templates: [],
    },
    {
      label: '네, 배달과 포장을 함께 운영해요',
      value: 1,
      templates: ['D-1', 'D-2'],
    },
  ],
};

/**
 * Q3-1. (Q3 = 예 선택 시) 배달·포장을 언제 선택하게 하시겠어요?
 */
export const q3_1: Question = {
  id: 'q3_1',
  title: '배달·포장을 언제 선택하게 하시겠어요?',
  options: [
    {
      label: '앱을 열자마자 첫 화면에서 배달·포장을 바로 선택하게 하고 싶어요',
      value: 0,
      templates: ['D-1'],
    },
    {
      label: '평소엔 브랜드 화면을 보여주다가, 주문 버튼을 눌렀을 때 선택하게 하고 싶어요',
      value: 1,
      templates: ['D-2'],
    },
  ],
};

export const allQuestions = { q1, q2, q3, q3_1 };

/**
 * 추천 로직 (기획서 v2.0 기준)
 * - Q3 = 예: D계열 강제 (Q3-1 응답에 따라 D-1/D-2 우선 정렬)
 * - Q3 = 아니요: Q1·Q2 교집합 유지, D계열 제외
 * - Q3 미응답: Q1·Q2 교집합 (D계열 포함 가능)
 * - Q2 스킵(Q1 = 로드샵·외곽): Q1 결과만 사용
 */
export function getRecommendedTemplates(answers: RecommendAnswer): TemplateId[] {
  // Q3 = 예: D계열 강제 전환
  if (answers.q3 === 1) {
    if (answers.q3_1 === 0) return ['D-1', 'D-2'];
    if (answers.q3_1 === 1) return ['D-2', 'D-1'];
    return ['D-1', 'D-2'];
  }

  const q1Templates =
    answers.q1 !== null ? q1.options[answers.q1]?.templates ?? [] : [];
  const q2Templates =
    answers.q2 !== null ? q2.options[answers.q2]?.templates ?? [] : [];

  let recommended: TemplateId[] = [];

  if (q1Templates.length > 0 && q2Templates.length > 0) {
    // 교집합 우선
    const intersection = q1Templates.filter((id) => q2Templates.includes(id));
    recommended = [...intersection];
    // 차순위로 Q1 → Q2 순서로 합집합 보강
    for (const id of q1Templates) {
      if (!recommended.includes(id)) recommended.push(id);
    }
    for (const id of q2Templates) {
      if (!recommended.includes(id)) recommended.push(id);
    }
  } else if (q1Templates.length > 0) {
    recommended = [...q1Templates];
  } else if (q2Templates.length > 0) {
    recommended = [...q2Templates];
  } else {
    recommended = ['A-1', 'B-1', 'B-2'];
  }

  // Q3 = 아니요: D계열 제외
  if (answers.q3 === 0) {
    recommended = recommended.filter((id) => id !== 'D-1' && id !== 'D-2');
    if (recommended.length === 0) {
      recommended = ['A-1', 'B-1'];
    }
  }

  return recommended;
}
