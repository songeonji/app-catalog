import { create } from 'zustand';
import type {
  Step,
  TemplateId,
  BannerRatio,
  ScreenTab,
  CustomizeState,
  RecommendAnswer,
} from '../types';

interface AppState {
  step: Step;
  mode: 'recommend' | 'gallery';
  completedSteps: Set<Step>;
  customize: CustomizeState;
  recommendAnswers: RecommendAnswer;

  // Actions
  setStep: (step: Step) => void;
  setMode: (mode: 'recommend' | 'gallery') => void;
  completeStep: (step: Step) => void;
  setTemplateId: (id: TemplateId) => void;
  setBrandColor: (color: string) => void;
  setHeaderBI: (bi: CustomizeState['headerBI']) => void;
  setBannerRatio: (ratio: BannerRatio) => void;
  setBrandName: (name: string) => void;
  setQuickMenuOrder: (order: string[]) => void;
  setFabIconUrl: (url: string | null) => void;
  setActiveScreen: (screen: ScreenTab) => void;
  setRecommendAnswer: <K extends keyof RecommendAnswer>(
    key: K,
    value: RecommendAnswer[K],
  ) => void;
  resetCustomize: () => void;
  getShareUrl: () => string;
}

const defaultCustomize: CustomizeState = {
  templateId: null,
  brandColor: '#4F7FFF',
  headerBI: { type: 'text', url: null },
  bannerRatio: '2:1',
  brandName: '',
  quickMenuOrder: ['주문', '쿠폰', '스탬프', '소식'],
  fabIconUrl: null,
  activeScreen: 'home',
};

const defaultAnswers: RecommendAnswer = {
  q1: null,
  q2: [],
  q3: null,
  q3_1: null,
};

export const useAppStore = create<AppState>((set, get) => ({
  step: 1,
  mode: 'recommend',
  completedSteps: new Set<Step>(),
  customize: { ...defaultCustomize },
  recommendAnswers: { ...defaultAnswers },

  setStep: (step) => set({ step }),

  setMode: (mode) => set({ mode }),

  completeStep: (step) =>
    set((state) => ({
      completedSteps: new Set([...state.completedSteps, step]),
    })),

  setTemplateId: (id) =>
    set((state) => ({
      customize: { ...state.customize, templateId: id },
    })),

  setBrandColor: (color) =>
    set((state) => ({
      customize: { ...state.customize, brandColor: color },
    })),

  setHeaderBI: (bi) =>
    set((state) => ({
      customize: { ...state.customize, headerBI: bi },
    })),

  setBannerRatio: (ratio) =>
    set((state) => ({
      customize: { ...state.customize, bannerRatio: ratio },
    })),

  setBrandName: (name) =>
    set((state) => ({
      customize: { ...state.customize, brandName: name },
    })),

  setQuickMenuOrder: (order) =>
    set((state) => ({
      customize: { ...state.customize, quickMenuOrder: order },
    })),

  setFabIconUrl: (url) =>
    set((state) => ({
      customize: { ...state.customize, fabIconUrl: url },
    })),

  setActiveScreen: (screen) =>
    set((state) => ({
      customize: { ...state.customize, activeScreen: screen },
    })),

  setRecommendAnswer: (key, value) =>
    set((state) => ({
      recommendAnswers: { ...state.recommendAnswers, [key]: value },
    })),

  resetCustomize: () =>
    set({
      customize: { ...defaultCustomize },
      recommendAnswers: { ...defaultAnswers },
    }),

  getShareUrl: () => {
    const { customize } = get();
    const params = new URLSearchParams();
    if (customize.templateId) {
      params.set('template', customize.templateId);
    }
    if (customize.brandColor) {
      params.set('color', customize.brandColor.replace('#', ''));
    }
    if (customize.brandName) {
      params.set('brand', customize.brandName);
    }
    if (customize.bannerRatio !== '2:1') {
      params.set('ratio', customize.bannerRatio);
    }
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return `${base}/share?${params.toString()}`;
  },
}));
