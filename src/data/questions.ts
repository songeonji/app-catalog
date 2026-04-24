import type { TemplateId } from '../types';

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
  /** 기획서 v2.1 — Q2는 복수 선택. 나머지는 단일 선택. */
  multi?: boolean;
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
      templates: ['A-2', 'C-4'],
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
 * Q2. 매장에 대해 해당하는 항목을 모두 선택해주세요. (복수 선택 가능, 기획서 v2.1)
 * (Q1 = 로드샵·외곽 선택 시 스킵 / 아무것도 해당 없으면 그냥 다음으로)
 *   value 0 = A (단골), 1 = B (빠른주문), 2 = C (이벤트)
 */
export const q2: Question = {
  id: 'q2',
  title: '매장에 대해 해당하는 항목을 모두 선택해주세요',
  subtitle: '복수 선택 가능, 해당사항이 없다면 그냥 넘어가셔도 돼요.',
  multi: true,
  options: [
    {
      label: '재방문·단골 고객이 많은 편이에요',
      value: 0,
      description: '멤버십·스탬프를 홈에서 바로 확인할 수 있는 구성',
      templates: ['A-1', 'A-2', 'B-2', 'B-3'],
    },
    {
      label: '점심시간처럼 짧은 시간에 주문이 몰려요',
      value: 1,
      description: '주문 버튼이 항상 떠있거나 첫 화면에서 바로 진입 가능한 구성',
      templates: ['B-1', 'B-2', 'C-2'],
    },
    {
      label: '쿠폰·이벤트를 앱에서 적극적으로 운영할 예정이에요',
      value: 2,
      description: '이벤트 배너·쿠폰 동선이 강조된 구성',
      templates: ['A-2', 'C-4'],
    },
  ],
};

/**
 * Q3. 배달 서비스를 운영하시나요?
 * - 아니요: Q1·Q2 결과 유지, D계열 제외
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
