import type { TemplateId, RecommendAnswer } from '../types';
import { q1 as Q1, q2 as Q2 } from './questions';

/**
 * 기획서 v2.1 "비추천 사유 전체 조합 테이블" 기반 추천 로직.
 *
 * 반환:
 *  - primary: 최우선 추천 1종 ("★ 가장 잘 맞아요")
 *  - closeRecs: 근접 추천 0~2종 ("추천해요")
 *  - notRecommended: 비추천 사유 2~3건 ("이 시안들은 맞지 않아요")
 *
 * 비추천 규칙:
 *  - Q1 × Q2 조합별로 기획서의 명시적 비추천 목록 사용
 *  - Q3 = 예(배달+포장 운영): D-1/D-2 강제 분기, 나머지 계열 일괄 비추천
 *  - Q3 = 아니요: D계열은 closeRecs에서 제외 (단, D-1이 "맞지 않는 이유"로 비추천 표시는 유지)
 */

export interface NotRecommendItem {
  templateIds: TemplateId[];
  reason: string;
}

export interface Recommendation {
  primary: TemplateId | null;
  closeRecs: TemplateId[];
  notRecommended: NotRecommendItem[];
}

/** 배달 운영 시 D계열 외 전 시안이 배달/포장 분기 부재로 공통 비추천 */
const NOT_REC_NON_D: NotRecommendItem = {
  templateIds: ['A-1', 'A-2', 'B-1', 'B-2', 'B-3', 'C-1', 'C-2', 'C-3', 'C-4'],
  reason:
    '배달과 포장 중 어떤 방식으로 주문할지 선택하는 화면이 없어요. 두 가지 주문 방식을 운영한다면 고객이 원하는 방식으로 주문하기 어려울 수 있어요.',
};

/** Q1×Q2 primary + notRecommended 테이블 (Q1 = 0·1·2만; Q1 = 3 로드샵은 별도 Q3 분기) */
interface TableEntry {
  primary: TemplateId;
  notRecommended: NotRecommendItem[];
}

const TABLE: Record<string, TableEntry> = {
  // Q1 = 0 : 오피스·직장가
  '0-0': {
    primary: 'B-1',
    notRecommended: [
      {
        templateIds: ['A-2'],
        reason:
          '멤버십 카드를 옆으로 넘겨야 정보가 보여요. 점심시간에 빠르게 주문하려는 고객은 그 전에 화면을 닫을 수 있어요.',
      },
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 빠른 주문이 목적인 고객에게는 스캔보다 주문 버튼이 먼저 보여야 해요.',
      },
      {
        templateIds: ['C-3', 'C-4'],
        reason:
          '버튼이 많을수록 첫 화면에서 뭘 눌러야 할지 고민하는 시간이 생겨요. 매일 오는 단골에게는 필요 없는 선택지가 화면을 채웁니다.',
      },
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
    ],
  },
  '0-1': {
    primary: 'C-2',
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 이벤트나 혜택에 관심 많은 고객에게 바코드는 첫 화면에 둘 만큼 중요하지 않아요.',
      },
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
      {
        templateIds: ['A-1', 'A-2'],
        reason:
          '하단 탭바 방식은 스크롤 중에 주문 버튼이 가려질 수 있어요. 빠른 주문보다 탐색을 유도하는 구성이라 오피스 상권과는 맞지 않아요.',
      },
    ],
  },
  '0-2': {
    primary: 'B-2',
    notRecommended: [
      {
        templateIds: ['C-3', 'C-4'],
        reason:
          '버튼이 많으면 어디를 눌러야 할지 헷갈릴 수 있어요. 자주 오는 고객일수록 화면은 단순할수록 좋아요.',
      },
      {
        templateIds: ['A-2'],
        reason:
          '멤버십 카드를 옆으로 넘겨야 정보가 보여요. 손에 익숙하지 않은 동작을 요구하면 불편함을 느낄 수 있어요.',
      },
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
    ],
  },
  '0-3': {
    primary: 'B-1',
    notRecommended: [
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 처음 방문하는 고객에게는 바코드보다 브랜드와 주문 버튼이 먼저 보여야 해요.',
      },
      {
        templateIds: ['C-3', 'C-4'],
        reason:
          '버튼이 많을수록 처음 온 고객이 어디를 눌러야 할지 헷갈릴 수 있어요.',
      },
    ],
  },
  // Q1 = 1 : 주거·골목상권
  '1-0': {
    primary: 'B-2',
    notRecommended: [
      {
        templateIds: ['C-3', 'C-4'],
        reason:
          '버튼이 많을수록 첫 화면에서 뭘 눌러야 할지 고민하는 시간이 생겨요. 퇴근 후 피곤한 상태로 방문하는 고객에게는 단순한 화면이 더 편해요.',
      },
      {
        templateIds: ['A-2'],
        reason:
          '멤버십 카드를 옆으로 넘겨야 정보가 보여요. 빠르게 주문하려는 고객에게는 한 번 더 동작을 요구하는 셈이에요.',
      },
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
    ],
  },
  '1-1': {
    primary: 'A-2',
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 쿠폰·이벤트에 관심 많은 고객에게 바코드는 자주 쓰는 기능이 아니에요.',
      },
      {
        templateIds: ['C-1'],
        reason:
          '기능 버튼이 배너 아래 숨어 있어요. 자주 쓰는 기능을 찾으려면 스크롤을 내려야 해서 단골 고객에게 불편할 수 있어요.',
      },
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
    ],
  },
  '1-2': {
    primary: 'B-3',
    notRecommended: [
      {
        templateIds: ['C-3', 'C-4'],
        reason:
          '버튼이 많으면 어디를 눌러야 할지 헷갈릴 수 있어요. 화면이 단순할수록 자주 오는 고객이 편하게 쓸 수 있어요.',
      },
      {
        templateIds: ['A-2'],
        reason:
          '멤버십 카드를 옆으로 넘겨야 정보가 보여요. 손에 익숙하지 않은 동작을 요구하면 불편함을 느낄 수 있어요.',
      },
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
    ],
  },
  '1-3': {
    primary: 'A-1',
    notRecommended: [
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 단골 고객이 많지만 바코드 스캔보다 스탬프·쿠폰 확인이 더 자주 필요한 상권이에요.',
      },
      {
        templateIds: ['C-3', 'C-4'],
        reason:
          '버튼이 많을수록 처음 온 고객이 어디를 눌러야 할지 헷갈릴 수 있어요.',
      },
    ],
  },
  // Q1 = 2 : 쇼핑몰·번화가
  '2-0': {
    primary: 'C-2',
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 처음 방문하는 고객이 많은 상권에서는 브랜드 소개와 주문이 먼저 보여야 해요.',
      },
      {
        templateIds: ['C-4'],
        reason:
          '버튼이 2줄로 빽빽하게 채워져 있어요. 처음 온 고객이 어디를 눌러야 할지 고민하는 시간이 생겨요.',
      },
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
    ],
  },
  '2-1': {
    primary: 'C-3',
    notRecommended: [
      {
        templateIds: ['B-2'],
        reason:
          '스탬프 현황 카드가 상단을 차지해요. 처음 온 고객에게는 적립 현황보다 이벤트와 메뉴가 먼저 보여야 해요.',
      },
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 처음 방문하는 고객이 많은 상권에서는 브랜드와 혜택이 먼저 눈에 띄어야 해요.',
      },
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
    ],
  },
  '2-2': {
    primary: 'C-1',
    notRecommended: [
      {
        templateIds: ['C-3', 'C-4'],
        reason:
          '버튼이 많으면 어디를 눌러야 할지 헷갈릴 수 있어요. 처음 온 고객일수록 선택지가 적을수록 편해요.',
      },
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 처음 방문하는 고객에게는 바코드보다 브랜드와 주문 버튼이 먼저 보여야 해요.',
      },
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
    ],
  },
  '2-3': {
    primary: 'A-2',
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 신규 고객이 많은 상권에서는 브랜드 소개와 주문이 먼저 보여야 해요.',
      },
      {
        templateIds: ['C-4'],
        reason:
          '버튼이 2줄로 빽빽하게 채워져 있어요. 처음 온 고객이 어디를 눌러야 할지 고민하는 시간이 생겨요.',
      },
      {
        templateIds: ['D-1'],
        reason:
          '화면 절반이 배달·포장 선택으로 채워져 있어요. 배달을 운영하지 않는다면 고객이 누를 수 없는 버튼이 항상 보이는 셈입니다.',
      },
    ],
  },
};

/** Q1, Q2 각 답변이 연결한 templates 목록 (questions.ts 기반) */
function getQ1Templates(q1Value: number): TemplateId[] {
  return (Q1.options[q1Value]?.templates ?? []) as TemplateId[];
}
function getQ2Templates(q2Value: number | null): TemplateId[] {
  if (q2Value === null) return [];
  return (Q2.options[q2Value]?.templates ?? []) as TemplateId[];
}

/**
 * closeRecs 자동 계산:
 *  (Q1 templates ∪ Q2 templates) − primary − notRec template IDs
 *  교집합 → Q1-only → Q2-only 순으로 정렬 후 상위 2종
 */
function computeCloseRecs(
  primary: TemplateId,
  notRec: NotRecommendItem[],
  q1Value: number,
  q2Value: number | null,
  excludeD: boolean,
): TemplateId[] {
  const q1Set = getQ1Templates(q1Value);
  const q2Set = getQ2Templates(q2Value);
  const excluded = new Set<TemplateId>([primary]);
  for (const item of notRec) {
    for (const id of item.templateIds) excluded.add(id);
  }
  if (excludeD) {
    excluded.add('D-1');
    excluded.add('D-2');
  }

  const intersection = q1Set.filter(
    (id) => q2Set.includes(id) && !excluded.has(id),
  );
  const q1Only = q1Set.filter(
    (id) => !q2Set.includes(id) && !excluded.has(id),
  );
  const q2Only = q2Set.filter(
    (id) => !q1Set.includes(id) && !excluded.has(id),
  );

  const ordered = [...intersection, ...q1Only, ...q2Only];
  // 중복 제거
  return Array.from(new Set(ordered)).slice(0, 2);
}

/** 비추천 리스트에서 특정 templateIds를 제거하고 비어 있으면 항목 자체를 drop */
function stripFromNotRec(
  items: NotRecommendItem[],
  remove: TemplateId[],
): NotRecommendItem[] {
  const removeSet = new Set(remove);
  return items
    .map((item) => ({
      ...item,
      templateIds: item.templateIds.filter((id) => !removeSet.has(id)),
    }))
    .filter((item) => item.templateIds.length > 0);
}

/** 메인 엔트리포인트 */
export function getRecommendation(answers: RecommendAnswer): Recommendation {
  // ── Q3 = 예 (배달 운영) → D-1 / D-2 강제 분기
  if (answers.q3 === 1) {
    if (answers.q3_1 === 0) {
      return {
        primary: 'D-1',
        closeRecs: [],
        notRecommended: [
          {
            templateIds: ['D-2'],
            reason:
              '배너와 메뉴를 먼저 보여주다가 주문 버튼을 눌러야 배달·포장 선택이 나와요. 차를 세우고 빠르게 주문하려는 고객에게는 한 단계가 더 생기는 셈이에요.',
          },
          NOT_REC_NON_D,
        ],
      };
    }
    if (answers.q3_1 === 1) {
      return {
        primary: 'D-2',
        closeRecs: [],
        notRecommended: [
          {
            templateIds: ['D-1'],
            reason:
              '앱을 열자마자 배달·포장 선택 화면이 나와요. 브랜드 이미지나 추천 메뉴를 먼저 보여줄 수 없고, 이벤트 배너도 노출되지 않아요.',
          },
          NOT_REC_NON_D,
        ],
      };
    }
    // Q3-1 미응답 방어
    return {
      primary: 'D-1',
      closeRecs: ['D-2'],
      notRecommended: [NOT_REC_NON_D],
    };
  }

  // ── Q1 = 로드샵·외곽 (Q2 스킵). Q3 = 아니요 / 미응답 분기
  if (answers.q1 === 3) {
    // 로드샵인데 배달 안 함 → 범용 추천
    return {
      primary: 'B-1',
      closeRecs: ['A-1', 'C-1'],
      notRecommended: [NOT_REC_NON_D],
    };
  }

  // ── 일반 Q1 × Q2
  if (answers.q1 === null || answers.q2 === null) {
    return { primary: null, closeRecs: [], notRecommended: [] };
  }

  const key = `${answers.q1}-${answers.q2}`;
  const entry = TABLE[key];
  if (!entry) {
    return {
      primary: 'B-1',
      closeRecs: ['A-1'],
      notRecommended: [],
    };
  }

  const excludeD = answers.q3 === 0;
  const closeRecs = computeCloseRecs(
    entry.primary,
    entry.notRecommended,
    answers.q1,
    answers.q2,
    excludeD,
  );

  // Q3 = 아니요 → closeRecs에서는 D계열 제외 (위에서 처리됨),
  // 비추천 목록은 그대로 유지 (D-1이 "맞지 않는 이유"로 노출되어야 학습효과 있음)
  return {
    primary: entry.primary,
    closeRecs,
    notRecommended: entry.notRecommended,
  };
}

/** 레거시 호환: templateId 우선순위 배열 (커스터마이즈 등 다른 곳에서 쓸 수 있음) */
export function getRecommendedTemplateIds(
  answers: RecommendAnswer,
): TemplateId[] {
  const r = getRecommendation(answers);
  return [r.primary, ...r.closeRecs].filter(
    (id): id is TemplateId => id !== null,
  );
}

export { stripFromNotRec };
