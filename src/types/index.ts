export type Step = 1 | 2 | 3 | 4;

export type TemplateId =
  | 'A-1'
  | 'A-2'
  | 'B-1'
  | 'B-2'
  | 'B-3'
  | 'C-1'
  | 'C-2'
  | 'C-4'
  | 'D-1'
  | 'D-2';

export type SectionId = 'A' | 'B' | 'C' | 'D';

export type BannerRatio = '2:1' | '3:2' | '1:1' | '3:4';

export type ScreenTab = 'home' | 'order' | 'coupon' | 'stamp' | 'news';

export interface Template {
  id: TemplateId;
  section: SectionId;
  name: string;
  type: string;
  description: string;
  recommendation: string;
  gradient: {
    from: string;
    to: string;
  };
}

export interface Section {
  id: SectionId;
  name: string;
  description: string;
}

export interface CustomizeState {
  templateId: TemplateId | null;
  brandColor: string;
  headerBI: {
    type: 'image' | 'text';
    url: string | null;
  };
  bannerRatio: BannerRatio;
  brandName: string;
  quickMenuOrder: string[];
  fabIconUrl: string | null;
  activeScreen: ScreenTab;
}

export interface RecommendAnswer {
  q1: number | null;
  /** Q2는 복수 선택 (기획서 v2.1). 빈 배열 = 아무것도 해당 없음. */
  q2: number[];
  q3: number | null;
  q3_1: number | null;
}
