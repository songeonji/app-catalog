import type { Template, Section, SectionId, TemplateId } from '../types';

export const sections: Section[] = [
  {
    id: 'A',
    name: 'GNB 탭바형',
    description: '하단 탭바로 주요 메뉴를 빠르게 전환할 수 있는 구조',
  },
  {
    id: 'B',
    name: 'FAB형',
    description: '플로팅 버튼으로 핵심 액션에 빠르게 접근하는 구조',
  },
  {
    id: 'C',
    name: '타일메뉴형',
    description: '타일 형태의 메뉴로 다양한 기능을 한눈에 보여주는 구조',
  },
  {
    id: 'D',
    name: '배달카드형',
    description: '배달/포장 중심의 카드형 UI 구조',
  },
];

export const templates: Template[] = [
  // Section A — GNB 탭바형
  {
    id: 'A-1',
    section: 'A',
    name: '스탬프 카드형',
    type: 'GNB 탭바형',
    description: '스탬프 적립 카드가 홈 화면 상단에 노출되어 재방문을 유도하는 구조',
    recommendation: '리워드 중심 운영, 카페/베이커리',
    gradient: { from: '#FF8F6B', to: '#FFB89E' },
  },
  {
    id: 'A-2',
    section: 'A',
    name: '캐러셀 쿠폰형',
    type: 'GNB 탭바형',
    description: '쿠폰 캐러셀이 홈 화면에서 프로모션을 강조하는 구조',
    recommendation: '프로모션 중심 운영, 프랜차이즈',
    gradient: { from: '#FF6B4A', to: '#FF8F6B' },
  },
  // Section B — FAB형
  {
    id: 'B-1',
    section: 'B',
    name: '기본 타일형',
    type: 'FAB형',
    description: '심플한 타일 메뉴와 FAB 버튼을 결합한 기본 구조',
    recommendation: '범용적 사용, 소규모 매장',
    gradient: { from: '#4F7FFF', to: '#7FA3FF' },
  },
  {
    id: 'B-2',
    section: 'B',
    name: '스탬프 카드 FAB',
    type: 'FAB형',
    description: '스탬프 카드와 FAB 버튼을 결합하여 리워드와 주문을 동시에 강조',
    recommendation: '리워드+주문 병행, 카페',
    gradient: { from: '#3D6DE8', to: '#4F7FFF' },
  },
  {
    id: 'B-3',
    section: 'B',
    name: '멤버십 바코드형',
    type: 'FAB형',
    description: '멤버십 바코드를 홈 화면에 바로 노출하여 매장 결제를 간편하게',
    recommendation: '오프라인 매장 중심, 멤버십 운영',
    gradient: { from: '#2B5BD6', to: '#4F7FFF' },
  },
  // Section C — 타일메뉴형
  {
    id: 'C-1',
    section: 'C',
    name: '배너+타일',
    type: '타일메뉴형',
    description: '상단 배너와 타일 메뉴를 결합하여 프로모션과 기능을 동시에 노출',
    recommendation: '프로모션+기능 병행, 중대형 매장',
    gradient: { from: '#50C878', to: '#7FD9A0' },
  },
  {
    id: 'C-2',
    section: 'C',
    name: '리스트 타일',
    type: '타일메뉴형',
    description: '리스트형 타일로 메뉴를 정돈되게 보여주는 구조',
    recommendation: '메뉴 항목이 많은 매장, 레스토랑',
    gradient: { from: '#3DB86A', to: '#50C878' },
  },
  {
    id: 'C-3',
    section: 'C',
    name: '5열 소형 타일',
    type: '타일메뉴형',
    description: '5열 소형 타일로 많은 메뉴를 컴팩트하게 배치',
    recommendation: '기능이 많은 앱, 편의점/마트',
    gradient: { from: '#2DA85C', to: '#50C878' },
  },
  {
    id: 'C-4',
    section: 'C',
    name: '2행 격자 타일',
    type: '타일메뉴형',
    description: '2행 격자 형태로 주요 메뉴를 균등하게 배치',
    recommendation: '균형 잡힌 메뉴 구성, 복합매장',
    gradient: { from: '#1E9850', to: '#50C878' },
  },
  // Section D — 배달카드형
  {
    id: 'D-1',
    section: 'D',
    name: '전면 카드',
    type: '배달카드형',
    description: '전면 카드 형태로 배달/포장 주문을 강조하는 구조',
    recommendation: '배달 전문점, 치킨/피자',
    gradient: { from: '#9B6BFF', to: '#B99AFF' },
  },
  {
    id: 'D-2',
    section: 'D',
    name: '오버레이 팝업',
    type: '배달카드형',
    description: '오버레이 팝업으로 배달/포장 선택을 유도하는 구조',
    recommendation: '배달+매장 병행, 분식/중식',
    gradient: { from: '#8352E8', to: '#9B6BFF' },
  },
];

export const getTemplateById = (id: TemplateId): Template | undefined =>
  templates.find((t) => t.id === id);

export const getTemplatesBySection = (section: SectionId): Template[] =>
  templates.filter((t) => t.section === section);

export const sectionColors: Record<SectionId, { main: string; bg: string }> = {
  A: { main: '#FF8F6B', bg: '#FFF5F0' },
  B: { main: '#4F7FFF', bg: '#F0F4FF' },
  C: { main: '#50C878', bg: '#F0FFF5' },
  D: { main: '#9B6BFF', bg: '#F5F0FF' },
};
