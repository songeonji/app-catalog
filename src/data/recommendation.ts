import type { TemplateId, RecommendAnswer } from '../types';

/**
 * 기획서 v2.1 — "비추천 사유 전체 조합 테이블" 기반 추천 로직.
 *
 * 반환:
 *  - primary: 최우선 추천 1종 ("★ 가장 잘 맞아요")
 *  - closeRecs: 근접 추천 0~2종 ("추천해요")
 *  - notRecommended: 비추천 사유 (카드별)
 *
 * Q2 체크 조합 키: A(단골)=0, B(빠른주문)=1, C(이벤트)=2
 * 조합 키 계산 — 선택된 value 집합을 알파벳 정렬 문자열로 직렬화.
 *  예: [0,2] → "AC", [0,1,2] → "ABC", [] → "NONE"
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

/** Q3 = 예(배달 운영) 시 D계열 외 시안 공통 비추천 사유 (기획서 v2.1 로드샵 행 문구) */
const NOT_REC_NON_D: NotRecommendItem = {
  templateIds: ['B-1', 'B-2', 'B-3', 'C-1', 'C-2', 'C-4'],
  reason:
    '배달·포장 선택 화면 자체가 없어요. 두 가지 주문 방식을 운영한다면 고객이 원하는 방식으로 주문하기 어려울 수 있어요.',
};

interface TableEntry {
  primary: TemplateId;
  closeRecs: TemplateId[];
  notRecommended: NotRecommendItem[];
}

/** Q1(0|1|2) × Q2 조합(ABC|AB|AC|BC|A|B|C|NONE) 매핑 테이블 */
const TABLE: Record<string, TableEntry> = {
  // ── Q1 = 0 : 🏢 오피스·직장가 ────────────────────────────
  '0-ABC': {
    primary: 'B-2',
    closeRecs: ['C-2'],
    notRecommended: [
      {
        templateIds: ['A-2'],
        reason:
          '멤버십 카드를 옆으로 넘겨야 정보가 보여요. 바쁜 시간에 빠르게 주문하려는 고객에게 한 동작이 더 생겨요.',
      },
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 빠른 주문이 목적인 고객에게는 스캔보다 주문 버튼이 먼저 보여야 해요.',
      },
      {
        templateIds: ['C-4'],
        reason:
          '버튼이 많을수록 뭘 눌러야 할지 고민하는 시간이 생겨요. 매일 오는 단골에게는 불필요한 선택지가 화면을 채웁니다.',
      },
    ],
  },
  '0-AB': {
    primary: 'B-2',
    closeRecs: ['B-1'],
    notRecommended: [
      {
        templateIds: ['A-2'],
        reason:
          '멤버십 카드를 옆으로 넘겨야 해요. 점심시간에 빠르게 주문하려는 고객이 화면을 닫을 수 있어요.',
      },
      {
        templateIds: ['C-4'],
        reason: '버튼이 많으면 단골 고객에게도 매번 선택 부담이 생겨요.',
      },
    ],
  },
  '0-AC': {
    primary: 'C-2',
    closeRecs: ['B-2'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 이벤트·혜택에 관심 많은 단골에게 바코드는 우선순위가 아니에요.',
      },
      {
        templateIds: ['C-4'],
        reason: '버튼이 2줄로 빽빽해요. 오피스 상권 단골에게는 과도한 구성이에요.',
      },
    ],
  },
  '0-BC': {
    primary: 'C-2',
    closeRecs: ['B-1'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 빠른 주문과 이벤트 둘 다 원하는 고객에게 바코드는 방해 요소예요.',
      },
      {
        templateIds: ['A-1', 'A-2'],
        reason:
          '탭바 방식은 주문 버튼이 화면 중앙 탭에 묻혀요. 빠른 진입이 어렵고 오피스 상권과 맞지 않아요.',
      },
    ],
  },
  '0-A': {
    primary: 'B-2',
    closeRecs: ['A-1'],
    notRecommended: [
      {
        templateIds: ['C-4'],
        reason: '버튼이 많으면 단골 고객에게도 매번 선택 피로가 생겨요.',
      },
      {
        templateIds: ['B-3'],
        reason:
          '바코드 전면 노출은 단골보다는 포인트 적립 중심 매장에 적합해요.',
      },
    ],
  },
  '0-B': {
    primary: 'B-1',
    closeRecs: ['C-2'],
    notRecommended: [
      {
        templateIds: ['A-2'],
        reason:
          '멤버십 카드 슬라이드는 주문 전 불필요한 동작을 추가해요.',
      },
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 주문보다 앞에 나와요. 빠른 주문이 목적인 고객에게는 맞지 않아요.',
      },
    ],
  },
  '0-C': {
    primary: 'C-4',
    closeRecs: ['C-2'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '이벤트 노출이 없어요. 이벤트를 적극 운영할 예정이라면 배너·쿠폰 동선이 강조된 시안이 필요해요.',
      },
      {
        templateIds: ['B-2'],
        reason:
          '스탬프 카드가 상단을 차지해요. 이벤트를 앞에 내세우기 어려운 구조예요.',
      },
    ],
  },
  '0-NONE': {
    primary: 'B-1',
    closeRecs: ['A-1'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '처음 방문하는 고객에게 바코드는 낯설어요. 브랜드와 주문이 먼저 보여야 해요.',
      },
      {
        templateIds: ['C-4'],
        reason:
          '특별한 운영 특성 없이 버튼이 많으면 첫 방문 고객이 혼란스러울 수 있어요.',
      },
    ],
  },

  // ── Q1 = 1 : 🏘️ 주거·골목상권 ────────────────────────────
  '1-ABC': {
    primary: 'B-2',
    closeRecs: ['A-2'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 단골이 주문 전 이벤트·쿠폰도 확인하고 싶을 때 불편해요.',
      },
      {
        templateIds: ['C-4'],
        reason:
          '버튼이 많으면 빠르게 주문하려는 단골 고객에게 오히려 걸림돌이 돼요.',
      },
    ],
  },
  '1-AB': {
    primary: 'B-2',
    closeRecs: ['B-3'],
    notRecommended: [
      {
        templateIds: ['A-2'],
        reason:
          '멤버십 카드를 옆으로 넘겨야 해요. 빠른 주문과 단골 혜택 둘 다 원하는 고객에게 동작이 하나 더 생겨요.',
      },
      {
        templateIds: ['C-4'],
        reason:
          '단골 고객에게 매번 많은 버튼 중에서 선택하게 하면 피로도가 높아져요.',
      },
    ],
  },
  '1-AC': {
    primary: 'A-2',
    closeRecs: ['B-2'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드 전면 노출은 이벤트·쿠폰 확인을 원하는 단골에게 맞지 않아요.',
      },
      {
        templateIds: ['C-1'],
        reason:
          '기능 버튼이 배너 아래 숨어 있어요. 자주 쓰는 기능을 찾으려면 스크롤이 필요해 단골에게 불편해요.',
      },
    ],
  },
  '1-BC': {
    primary: 'C-2',
    closeRecs: ['B-1'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason: '바코드가 주문과 이벤트 동선을 모두 방해해요.',
      },
      {
        templateIds: ['A-1', 'A-2'],
        reason:
          '탭바 방식은 주문 버튼을 빠르게 찾기 어렵고 탐색 위주 구성이라 골목상권과는 맞지 않아요.',
      },
    ],
  },
  '1-A': {
    primary: 'B-3',
    closeRecs: ['A-1'],
    notRecommended: [
      {
        templateIds: ['C-4'],
        reason:
          '단골 고객에게 불필요한 버튼이 많으면 오히려 자주 쓰는 기능이 묻혀요.',
      },
      {
        templateIds: ['A-2'],
        reason:
          '멤버십 카드를 옆으로 넘겨야 해서 단골도 매번 스와이프해야 해요.',
      },
    ],
  },
  '1-B': {
    primary: 'B-1',
    closeRecs: ['C-2'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 주문보다 앞에 나와요. 빠른 주문을 원하는 고객에게 맞지 않아요.',
      },
      {
        templateIds: ['A-2'],
        reason:
          '멤버십 카드 슬라이드는 주문 전 불필요한 동작을 추가해요.',
      },
    ],
  },
  '1-C': {
    primary: 'A-2',
    closeRecs: ['C-4'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason: '바코드 전면 노출은 이벤트 중심 운영과 어울리지 않아요.',
      },
      {
        templateIds: ['C-1'],
        reason:
          '배너 아래에 이벤트 동선이 숨어 있어서 이벤트를 앞에 내세우기 어려워요.',
      },
    ],
  },
  '1-NONE': {
    primary: 'A-1',
    closeRecs: ['B-1'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 특별한 운영 특성 없이는 브랜드와 주문이 먼저 보이는 게 자연스러워요.',
      },
      {
        templateIds: ['C-4'],
        reason:
          '특별한 이유 없이 버튼이 많으면 처음 온 고객이 혼란스러울 수 있어요.',
      },
    ],
  },

  // ── Q1 = 2 : 🛍️ 쇼핑몰·번화가 ────────────────────────────
  '2-ABC': {
    primary: 'C-2',
    closeRecs: ['C-4'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 번화가 신규 고객에게 바코드는 낯설고, 이벤트 노출 기회도 줄어요.',
      },
      {
        templateIds: ['B-2'],
        reason:
          '스탬프 카드가 상단을 차지해요. 신규 고객이 많은 상권에서는 적립 현황보다 이벤트가 먼저 보여야 해요.',
      },
    ],
  },
  '2-AB': {
    primary: 'C-2',
    closeRecs: ['B-2'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 번화가 단골이라도 주문 버튼이 바로 보여야 재방문이 쉬워요.',
      },
      {
        templateIds: ['C-4'],
        reason:
          '버튼이 2줄로 빽빽해요. 빠르게 주문하려는 단골에게 선택 부담이 커요.',
      },
    ],
  },
  '2-AC': {
    primary: 'C-4',
    closeRecs: ['A-2'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드 전면 노출은 이벤트를 중심으로 운영하는 번화가 매장과 맞지 않아요.',
      },
      {
        templateIds: ['B-2'],
        reason:
          '스탬프 카드가 상단을 차지해요. 이벤트보다 단골 적립이 먼저 보여서 신규 고객 유입 효과가 줄어요.',
      },
    ],
  },
  '2-BC': {
    primary: 'C-4',
    closeRecs: ['C-2'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason: '바코드가 이벤트 동선과 빠른 주문 둘 다 방해해요.',
      },
      {
        templateIds: ['B-2'],
        reason:
          '스탬프 카드가 상단을 차지해요. 처음 온 고객에게 적립 현황보다 이벤트가 먼저 보여야 해요.',
      },
    ],
  },
  '2-A': {
    primary: 'C-1',
    closeRecs: ['B-2'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 번화가 단골에게도 주문과 브랜드 정보가 먼저 보이는 게 자연스러워요.',
      },
      {
        templateIds: ['C-4'],
        reason: '버튼이 많으면 단골도 매번 선택 부담이 생겨요.',
      },
    ],
  },
  '2-B': {
    primary: 'C-2',
    closeRecs: ['B-1'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason: '바코드가 주문 동선을 방해해요.',
      },
      {
        templateIds: ['C-4'],
        reason: '버튼 2줄 구성은 빠른 주문보다 탐색을 유도하는 구조예요.',
      },
    ],
  },
  '2-C': {
    primary: 'C-4',
    closeRecs: ['C-2'],
    notRecommended: [
      {
        templateIds: ['B-2'],
        reason:
          '스탬프 카드가 상단을 차지해요. 이벤트를 앞에 내세우기 어려운 구조예요.',
      },
      {
        templateIds: ['B-3'],
        reason: '바코드 전면 노출은 이벤트 중심 운영과 어울리지 않아요.',
      },
    ],
  },
  '2-NONE': {
    primary: 'A-2',
    closeRecs: ['C-1'],
    notRecommended: [
      {
        templateIds: ['B-3'],
        reason:
          '바코드가 첫 화면을 차지해요. 신규 고객이 많은 번화가에서 브랜드 소개가 먼저 보여야 해요.',
      },
      {
        templateIds: ['C-4'],
        reason:
          '버튼이 빽빽하게 채워져 있어요. 처음 온 고객이 어디를 눌러야 할지 고민하는 시간이 생겨요.',
      },
    ],
  },
};

/** Q2 복수 선택 배열 → TABLE 키 조각(ABC|AB|AC|BC|A|B|C|NONE). */
function getQ2ComboKey(q2: number[]): string {
  if (!q2 || q2.length === 0) return 'NONE';
  const set = new Set(q2);
  // 알파벳 A=0, B=1, C=2
  const letters: string[] = [];
  if (set.has(0)) letters.push('A');
  if (set.has(1)) letters.push('B');
  if (set.has(2)) letters.push('C');
  return letters.join('') || 'NONE';
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
              '배너와 메뉴를 먼저 보여주다가 주문 버튼을 눌러야 배달·포장 선택이 나와요. 차를 세우고 빠르게 주문하려는 고객에게 한 단계가 더 생기는 셈이에요.',
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
              '앱을 열자마자 배달·포장 선택 화면이 나와요. 브랜드 이미지나 이벤트 배너를 먼저 보여줄 수 없어요.',
          },
          NOT_REC_NON_D,
        ],
      };
    }
    // Q3-1 미응답 방어값
    return {
      primary: 'D-1',
      closeRecs: ['D-2'],
      notRecommended: [NOT_REC_NON_D],
    };
  }

  // ── Q1 = 로드샵·외곽 (Q2 스킵). Q3 = 아니요 → 일반 범용 추천.
  if (answers.q1 === 3) {
    return {
      primary: 'B-1',
      closeRecs: ['A-1', 'C-1'],
      notRecommended: [],
    };
  }

  // ── 일반 Q1 × Q2 조합
  if (answers.q1 === null) {
    return { primary: null, closeRecs: [], notRecommended: [] };
  }

  const comboKey = getQ2ComboKey(answers.q2);
  const key = `${answers.q1}-${comboKey}`;
  const entry = TABLE[key];
  if (!entry) {
    return {
      primary: 'B-1',
      closeRecs: ['A-1'],
      notRecommended: [],
    };
  }

  return {
    primary: entry.primary,
    closeRecs: entry.closeRecs,
    notRecommended: entry.notRecommended,
  };
}

/** 레거시 호환: templateId 우선순위 배열 */
export function getRecommendedTemplateIds(
  answers: RecommendAnswer,
): TemplateId[] {
  const r = getRecommendation(answers);
  return [r.primary, ...r.closeRecs].filter(
    (id): id is TemplateId => id !== null,
  );
}
