import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowCounterClockwise,
  CaretLeft,
  CaretRight,
  DotsSixVertical,
  ImageSquare,
  Lock,
  UploadSimple,
  Trash,
} from '@phosphor-icons/react';
import { useAppStore } from '../store';
import TopNav from '../components/TopNav';
import PhoneMockup from '../components/PhoneMockup';
import { getTemplateById, sectionColors } from '../data/templates';
import { trackEvent } from '../utils/analytics';
import type { BannerRatio, TemplateId } from '../types';

const BANNER_RATIOS: BannerRatio[] = ['2:1', '3:2', '1:1', '3:4'];

const TEMPLATE_CHIPS: { id: TemplateId; label: string; section: 'A' | 'B' | 'C' | 'D' }[] = [
  { id: 'B-2', label: 'B2', section: 'B' },
  { id: 'A-1', label: 'A1', section: 'A' },
  { id: 'A-2', label: 'A2', section: 'A' },
  { id: 'B-1', label: 'B1', section: 'B' },
  { id: 'B-3', label: 'B3', section: 'B' },
  { id: 'C-1', label: 'C1', section: 'C' },
  { id: 'C-2', label: 'C2', section: 'C' },
  { id: 'C-4', label: 'C4', section: 'C' },
  { id: 'D-1', label: 'D1', section: 'D' },
  { id: 'D-2', label: 'D2', section: 'D' },
];

/**
 * 시안별 전용 설정 스펙 (Outline [PHP] 신규앱 템플릿 기반)
 *
 * 용어 정리:
 * - "주문 기능은 고정" → 시안 UI에서 주문 진입점(GNB 주문탭 / FAB / 배달카드 등)이
 *   항상 노출되며 제거 불가. 이 고정 요소는 기능 선택 풀에 포함되지 않음.
 * - selectableCount → 사용자가 선택할 수 있는 기능 수 (고정 요소 제외)
 * - fixedFeatures → 기능 리스트 맨 앞에 항상 표시되는 고정 항목 (편집/제거 불가)
 */
interface TemplateConfig {
  featureLabel: string;
  selectableCount: number;
  fixedFeatures: string[];     // 기능 리스트에서 고정되는 항목들 (순서 변경/제거 불가)
  featurePool: string[];       // 선택 가능한 기능 풀
  hasFabIcon: boolean;
  hasOrderIcon: boolean;
  defaultFeatures: string[];   // 기본 선택 기능 (fixedFeatures 제외)
  fixedNote: string;           // 고정 요소 안내 문구
}

/** GNB 타입 기능 풀 (홈·주문 제외) */
const GNB_POOL = ['이벤트', '선물하기', '전체메뉴', '스탬프', '쿠폰', '매장찾기', '선불카드', '공지', '주문내역'];
/** 퀵메뉴/타일 기능 풀 */
const TILE_POOL = ['주문내역', '스탬프', '쿠폰', '공지', '선불카드', '매장찾기', '이벤트'];

const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  /* ── GNB 탭바형: GNB 5탭 = 홈(고정) + 선택4개 중 주문(고정,가운데) → 실제 선택 가능 3개 ── */
  /* 기획서: "GNB 기능 4개 선택 (주문 기능은 고정)" = 홈 + 3선택 + 주문(가운데 고정) = 5탭 */
  'A-1': {
    featureLabel: 'GNB 기능 선택',
    selectableCount: 3,
    fixedFeatures: [],
    featurePool: GNB_POOL,
    hasFabIcon: false,
    hasOrderIcon: true,
    defaultFeatures: ['이벤트', '선물하기', '전체메뉴'],
    fixedNote: '홈·주문 탭은 고정',
  },
  'A-2': {
    featureLabel: 'GNB 기능 선택',
    selectableCount: 3,
    fixedFeatures: [],
    featurePool: GNB_POOL,
    hasFabIcon: false,
    hasOrderIcon: true,
    defaultFeatures: ['이벤트', '선물하기', '전체메뉴'],
    fixedNote: '홈·주문 탭은 고정',
  },
  /* ── FAB형: 퀵메뉴 4타일 + FAB(주문 고정) ── */
  /* B-1: 고정 없음, 4개 전부 선택·순서 조정 */
  'B-1': {
    featureLabel: '기능 선택 · 순서',
    selectableCount: 4,
    fixedFeatures: [],
    featurePool: TILE_POOL,
    hasFabIcon: true,
    hasOrderIcon: false,
    defaultFeatures: ['스탬프', '쿠폰', '매장찾기', '이벤트'],
    fixedNote: 'FAB 주문 버튼은 항상 표시',
  },
  /* B-2, B-3: "주문 기능은 고정" = FAB 고정. 퀵메뉴 4타일 전부 선택·순서 조정 */
  'B-2': {
    featureLabel: '기능 선택 · 순서',
    selectableCount: 4,
    fixedFeatures: [],
    featurePool: TILE_POOL,
    hasFabIcon: true,
    hasOrderIcon: false,
    defaultFeatures: ['주문내역', '스탬프', '공지', '선불카드'],
    fixedNote: 'FAB 주문 버튼은 항상 표시',
  },
  'B-3': {
    featureLabel: '기능 선택 · 순서',
    selectableCount: 4,
    fixedFeatures: [],
    featurePool: TILE_POOL,
    hasFabIcon: true,
    hasOrderIcon: false,
    defaultFeatures: ['스탬프', '쿠폰', '매장찾기', '이벤트'],
    fixedNote: 'FAB 주문 버튼은 항상 표시',
  },
  /* ── 타일메뉴형: 주문 타일 고정 + N개 선택 ── */
  'C-1': {
    featureLabel: '타일메뉴 기능 선택',
    selectableCount: 2,
    fixedFeatures: ['주문'],
    featurePool: TILE_POOL,
    hasFabIcon: false,
    hasOrderIcon: false,
    defaultFeatures: ['주문내역', '매장찾기'],
    fixedNote: '주문 타일은 고정',
  },
  'C-2': {
    featureLabel: '타일메뉴 기능 선택',
    selectableCount: 3,
    fixedFeatures: ['주문'],
    featurePool: TILE_POOL,
    hasFabIcon: false,
    hasOrderIcon: false,
    defaultFeatures: ['쿠폰', '스탬프', '선불카드'],
    fixedNote: '주문 타일은 고정',
  },
  'C-4': {
    featureLabel: '타일메뉴 기능 선택',
    selectableCount: 5,
    fixedFeatures: ['주문'],
    featurePool: TILE_POOL,
    hasFabIcon: false,
    hasOrderIcon: false,
    defaultFeatures: ['스탬프', '선불카드', '이벤트', '매장찾기', '쿠폰'],
    fixedNote: '주문 타일은 고정',
  },
  /* ── 배달카드형 ── */
  /* D-1: 배달/포장 카드가 주문 진입점(고정). 하단 필탭 4개 전부 선택·순서 조정 */
  'D-1': {
    featureLabel: '기능 선택 · 순서',
    selectableCount: 4,
    fixedFeatures: [],
    featurePool: TILE_POOL,
    hasFabIcon: false,
    hasOrderIcon: false,
    defaultFeatures: ['주문내역', '쿠폰', '스탬프', '이벤트'],
    fixedNote: '배달·포장 카드는 항상 표시',
  },
  /* D-2: GNB 5탭, 주문 탭 고정 */
  'D-2': {
    featureLabel: 'GNB 기능 선택',
    selectableCount: 3,
    fixedFeatures: [],
    featurePool: GNB_POOL,
    hasFabIcon: false,
    hasOrderIcon: true,
    defaultFeatures: ['이벤트', '선물하기', '전체메뉴'],
    fixedNote: '홈·주문 탭은 고정',
  },
};

export default function Step2Customize() {
  const {
    step,
    completedSteps,
    customize,
    setBrandColor,
    setBrandName: _setBrandName,
    setHeaderBI,
    setBannerRatio,
    setQuickMenuOrder,
    setFabIconUrl,
    setTemplateId,
    resetCustomize,
    completeStep,
    setStep,
  } = useAppStore();

  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  /** GA4 SPA page_view: 화면 진입 시 1회 */
  useEffect(() => {
    window.history.pushState({}, '', '/step2-customize');
    document.title = 'STEP 02 커스터마이즈 · App Catalog';
  }, []);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const fabInputRef = useRef<HTMLInputElement>(null);
  const orderIconInputRef = useRef<HTMLInputElement>(null);

  const currentTemplate = customize.templateId
    ? getTemplateById(customize.templateId)
    : null;

  const config = customize.templateId
    ? TEMPLATE_CONFIGS[customize.templateId] ?? TEMPLATE_CONFIGS['B-2']
    : TEMPLATE_CONFIGS['B-2'];

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(config.defaultFeatures);

  const isHeaderVisible = customize.headerBI.type === 'image';

  /** 스토어에 최종 기능 순서 반영 (고정 항목 + 선택 항목) */
  const syncQuickMenuOrder = useCallback(
    (features: string[]) => {
      setQuickMenuOrder([...config.fixedFeatures, ...features]);
    },
    [config.fixedFeatures, setQuickMenuOrder],
  );

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('#')) val = '#' + val;
    setBrandColor(val);
  };

  const handleToggleBI = () => {
    if (isHeaderVisible) {
      setHeaderBI({ type: 'text', url: null });
    } else {
      setHeaderBI({ type: 'image', url: null });
    }
  };

  /** 파일 → data URL 변환 */
  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  /** 로고 이미지 업로드 */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    setHeaderBI({ type: 'image', url });
    e.target.value = '';
  };

  /** FAB 아이콘 업로드 */
  const handleFabIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    setFabIconUrl(url);
    e.target.value = '';
  };

  /** 기능 추가/제거 */
  const handleFeatureToggle = (feature: string) => {
    let next: string[];
    if (selectedFeatures.includes(feature)) {
      next = selectedFeatures.filter((f) => f !== feature);
    } else if (selectedFeatures.length < config.selectableCount) {
      next = [...selectedFeatures, feature];
    } else {
      return;
    }
    setSelectedFeatures(next);
    syncQuickMenuOrder(next);
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newOrder = [...selectedFeatures];
    const [removed] = newOrder.splice(dragIdx, 1);
    newOrder.splice(idx, 0, removed);
    setSelectedFeatures(newOrder);
    setDragIdx(idx);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    syncQuickMenuOrder(selectedFeatures);
    trackEvent('select_content', {
      content_type: 'customize_setting',
      item_id: 'feature_reorder',
    });
  };

  const handleReset = useCallback(() => {
    const currentTemplateId = customize.templateId;
    resetCustomize();
    if (currentTemplateId) {
      setTemplateId(currentTemplateId);
      const cfg = TEMPLATE_CONFIGS[currentTemplateId];
      if (cfg) {
        setSelectedFeatures(cfg.defaultFeatures);
        setQuickMenuOrder([...cfg.fixedFeatures, ...cfg.defaultFeatures]);
      }
    }
  }, [customize.templateId, resetCustomize, setTemplateId, setQuickMenuOrder]);

  const handleGoInteraction = () => {
    completeStep(2);
    setStep(3);
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

  // 시안 전환 시 전용 설정 리셋
  const handleTemplateSwitch = (id: TemplateId) => {
    setTemplateId(id);
    const cfg = TEMPLATE_CONFIGS[id];
    if (cfg) {
      setSelectedFeatures(cfg.defaultFeatures);
      setQuickMenuOrder([...cfg.fixedFeatures, ...cfg.defaultFeatures]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-white">
      <TopNav currentStep={step} completedSteps={completedSteps} />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Panel ── */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-[260px] shrink-0 bg-white border-r border-border overflow-y-auto flex flex-col"
        >
          <div className="p-5 flex-1">
            {/* Title */}
            <h2 className="text-lg font-bold text-text-primary">커스터마이즈</h2>
            <p className="text-xs text-text-muted mt-1">
              {currentTemplate
                ? `${currentTemplate.id} 시안을 커스터마이즈하고 있습니다`
                : '시안을 선택해주세요'}
            </p>

            {/* ── 공통 설정 ── */}
            <div className="flex items-center gap-2 mt-6 mb-4">
              <div className="w-4 h-[2px] rounded-full bg-primary" />
              <span className="text-sm font-bold text-text-primary">공통 설정</span>
            </div>

            {/* 색상 */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-text-secondary mb-2 block">색상</label>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-8 h-8 rounded-full border border-border shrink-0 cursor-pointer relative overflow-hidden"
                  style={{ backgroundColor: customize.brandColor }}
                >
                  <input
                    type="color"
                    value={customize.brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    onBlur={() =>
                      trackEvent('select_content', {
                        content_type: 'customize_setting',
                        item_id: 'brand_color',
                      })
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-text-primary">브랜드 컬러</span>
                  <input
                    type="text"
                    value={customize.brandColor}
                    onChange={handleColorChange}
                    onBlur={() =>
                      trackEvent('select_content', {
                        content_type: 'customize_setting',
                        item_id: 'brand_color',
                      })
                    }
                    maxLength={7}
                    className="text-xs font-mono text-text-muted w-20 focus:outline-none"
                  />
                </div>
              </div>
              <p className="text-[11px] text-text-muted leading-4">
                탭바, FAB, 버튼, 카드 배경 등 전체 Primary 색상에 적용
              </p>
            </div>

            <div className="h-px bg-border" />

            {/* 헤더 BI */}
            <div className="my-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-text-secondary">헤더 BI</label>
                <button
                  type="button"
                  onClick={handleToggleBI}
                  data-ga-event="select_content"
                  data-ga-param-content-type="customize_setting"
                  data-ga-param-item-id="header_bi_toggle"
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    isHeaderVisible ? 'bg-primary' : 'bg-border'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      isHeaderVisible ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              {isHeaderVisible && (
                <>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/svg+xml,image/jpeg"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {customize.headerBI.url ? (
                    <div className="relative h-12 rounded-lg border border-border bg-warm-white flex items-center justify-center overflow-hidden">
                      <img
                        src={customize.headerBI.url}
                        alt="로고"
                        className="h-8 object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setHeaderBI({ type: 'image', url: null })}
                        data-ga-event="select_content"
                        data-ga-param-content-type="customize_setting"
                        data-ga-param-item-id="header_bi_remove"
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white border border-border flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <Trash size={10} className="text-text-muted" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      data-ga-event="select_content"
                      data-ga-param-content-type="customize_setting"
                      data-ga-param-item-id="header_bi_upload"
                      className="w-full h-12 border-2 border-dashed border-border rounded-lg bg-warm-white flex items-center justify-center gap-1.5 hover:border-primary/40 transition-colors"
                    >
                      <ImageSquare size={16} className="text-text-disabled" />
                      <span className="text-[11px] text-text-disabled">로고 이미지 업로드</span>
                    </button>
                  )}
                </>
              )}
              <p className="text-[11px] text-text-muted mt-1.5">
                {isHeaderVisible ? 'ON: 헤더에 로고 이미지 노출' : 'OFF 시 텍스트 브랜드명 표시'}
              </p>
            </div>

            <div className="h-px bg-border" />

            {/* 배너 비율 */}
            <div className="my-5">
              <label className="text-xs font-semibold text-text-secondary mb-2 block">배너 비율</label>
              <div className="grid grid-cols-4 gap-1 bg-warm-white rounded-lg p-1">
                {BANNER_RATIOS.map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setBannerRatio(ratio)}
                    data-ga-event="select_content"
                    data-ga-param-content-type="customize_setting"
                    data-ga-param-item-id={`banner_ratio_${ratio}`}
                    className={`py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      customize.bannerRatio === ratio
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* ── 시안 전용 설정 ── */}
            <div className="flex items-center gap-2 mt-5 mb-4">
              <div className="w-4 h-[2px] rounded-full bg-primary" />
              <span className="text-sm font-bold text-text-primary">
                {currentTemplate ? `${currentTemplate.id} 전용 설정` : '시안 전용 설정'}
              </span>
            </div>

            {/* 기능 선택 · 순서 */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-text-secondary">
                  {config.featureLabel}
                </label>
                <span className="text-[11px] text-text-muted">
                  {selectedFeatures.length}/{config.selectableCount}개 선택
                </span>
              </div>
              <p className="text-[11px] text-text-muted mb-2">{config.fixedNote}</p>

              <div className="flex flex-col gap-1.5">
                {/* 고정 항목들 */}
                {config.fixedFeatures.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warm-white border border-border">
                    <Lock size={14} className="text-text-disabled shrink-0" />
                    <span className="text-sm text-text-muted flex-1">{feat}</span>
                    <span className="text-[10px] text-primary font-semibold">고정</span>
                  </div>
                ))}

                {/* 선택된 기능 (드래그 정렬 가능) */}
                {selectedFeatures.map((item, idx) => (
                  <div
                    key={item}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-border cursor-grab active:cursor-grabbing transition-shadow ${
                      dragIdx === idx ? 'shadow-md border-primary' : ''
                    }`}
                  >
                    <DotsSixVertical size={14} className="text-text-disabled shrink-0" />
                    <span className="text-sm text-text-primary flex-1">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleFeatureToggle(item)}
                      data-ga-event="select_content"
                      data-ga-param-content-type="customize_setting"
                      data-ga-param-item-id={`feature_remove_${item}`}
                      className="text-[10px] text-text-muted hover:text-red-400 transition-colors"
                    >
                      제거
                    </button>
                  </div>
                ))}

                {/* 추가 가능한 기능 */}
                {selectedFeatures.length < config.selectableCount && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {config.featurePool
                      .filter((f) => !selectedFeatures.includes(f) && !config.fixedFeatures.includes(f))
                      .map((feature) => (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => handleFeatureToggle(feature)}
                          data-ga-event="select_content"
                          data-ga-param-content-type="customize_setting"
                          data-ga-param-item-id={`feature_add_${feature}`}
                          className="px-2.5 py-1 rounded-md border border-dashed border-border text-[11px] text-text-muted hover:border-primary hover:text-primary transition-colors"
                        >
                          + {feature}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* FAB 오더 아이콘 (B-1, B-2, B-3 only) */}
            {config.hasFabIcon && (
              <>
                <div className="h-px bg-border mb-5" />
                <div className="mb-5">
                  <label className="text-xs font-semibold text-text-secondary mb-2 block">
                    FAB 오더 아이콘
                  </label>
                  <input
                    ref={fabInputRef}
                    type="file"
                    accept="image/png,image/svg+xml,image/jpeg"
                    onChange={handleFabIconUpload}
                    className="hidden"
                  />
                  {customize.fabIconUrl ? (
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={customize.fabIconUrl} alt="FAB" className="w-6 h-6 object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-text-primary">커스텀 아이콘 적용 중</p>
                        <p className="text-[11px] text-text-muted">PNG/SVG, 600×600 권장</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFabIconUrl(null)}
                        data-ga-event="select_content"
                        data-ga-param-content-type="customize_setting"
                        data-ga-param-item-id="fab_icon_remove"
                        className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <Trash size={12} className="text-text-muted" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-dark flex items-center justify-center shrink-0">
                        <UploadSimple size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-text-primary">기본 아이콘 사용 중</p>
                        <p className="text-[11px] text-text-muted">PNG/SVG, 600×600 권장</p>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fabInputRef.current?.click()}
                    data-ga-event="select_content"
                    data-ga-param-content-type="customize_setting"
                    data-ga-param-item-id="fab_icon_upload"
                    className="w-full py-2 rounded-lg border border-border text-xs text-text-secondary hover:bg-warm-white transition-colors"
                  >
                    이미지 {customize.fabIconUrl ? '변경' : '업로드'}
                  </button>
                </div>
              </>
            )}

            {/* 주문 아이콘 이미지 (A-1, A-2, D-2 only) */}
            {config.hasOrderIcon && (
              <>
                <div className="h-px bg-border mb-5" />
                <div className="mb-5">
                  <label className="text-xs font-semibold text-text-secondary mb-2 block">
                    주문 아이콘 이미지
                  </label>
                  <input
                    ref={orderIconInputRef}
                    type="file"
                    accept="image/png,image/svg+xml,image/jpeg"
                    onChange={handleFabIconUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => orderIconInputRef.current?.click()}
                    data-ga-event="select_content"
                    data-ga-param-content-type="customize_setting"
                    data-ga-param-item-id="order_icon_upload"
                    className="w-full h-14 border-2 border-dashed border-border rounded-lg bg-warm-white flex items-center justify-center gap-1.5 hover:border-primary/40 transition-colors"
                  >
                    <UploadSimple size={16} className="text-text-disabled" />
                    <span className="text-[11px] text-text-disabled">PNG/SVG, 600×600 권장</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── Bottom Actions ── */}
          <div className="p-5 border-t border-border flex flex-col gap-2">
            <button
              type="button"
              onClick={handleReset}
              data-ga-event="select_content"
              data-ga-param-content-type="restart"
              data-ga-param-item-id="customize_reset"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-warm-white transition-colors"
            >
              <ArrowCounterClockwise size={16} />
              초기화
            </button>
            <button
              type="button"
              onClick={handleGoInteraction}
              data-ga-event="select_content"
              data-ga-param-content-type="step_progress"
              data-ga-param-item-id="step2_to_step3"
              data-ga-param-item-category="bottom_cta"
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
            >
              인터랙션 체험하기
              <CaretRight size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={handleBackToStep1}
              className="flex items-center justify-center gap-1 w-full py-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
            >
              <CaretLeft size={12} weight="bold" />
              시안 선택으로 돌아가기
            </button>
          </div>
        </motion.aside>

        {/* ── Center - Phone Mockup ── */}
        <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#EBEBEB' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <PhoneMockup
              templateId={customize.templateId || 'B-2'}
              brandColor={customize.brandColor}
              brandName={customize.brandName}
              bannerRatio={customize.bannerRatio}
              activeScreen={customize.activeScreen}
              showHeaderBI={customize.headerBI.type === 'image'}
              headerLogoUrl={customize.headerBI.url}
              fabIconUrl={customize.fabIconUrl}
              quickMenuOrder={customize.quickMenuOrder}
            />
          </motion.div>
        </div>

        {/* ── Right Panel ── */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className={`shrink-0 bg-white border-l border-border flex flex-col transition-all duration-300 ${
            rightPanelOpen ? 'w-[200px]' : 'w-[80px]'
          }`}
        >
          <button
            type="button"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className="flex items-center justify-center py-4 border-b border-border hover:bg-warm-white transition-colors"
          >
            {rightPanelOpen ? (
              <CaretRight size={16} className="text-text-secondary" />
            ) : (
              <CaretLeft size={16} className="text-text-secondary" />
            )}
          </button>

          <div className="flex-1 overflow-y-auto p-3">
            <div className={`flex flex-col items-center gap-2 ${rightPanelOpen ? 'items-start' : ''}`}>
              {TEMPLATE_CHIPS.map((chip) => {
                const isActive = customize.templateId === chip.id;
                const color = sectionColors[chip.section].main;

                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleTemplateSwitch(chip.id)}
                    data-ga-event="select_content"
                    data-ga-param-content-type="template"
                    data-ga-param-item-id={chip.id}
                    data-ga-param-item-category="template_chip"
                    className={`flex items-center gap-2 rounded-full transition-all ${
                      rightPanelOpen ? 'px-3 py-1.5 w-full' : 'w-10 h-10 justify-center'
                    } ${
                      isActive
                        ? 'ring-2 ring-primary bg-primary-light'
                        : 'hover:bg-warm-white'
                    }`}
                    title={chip.id}
                  >
                    <div
                      className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      {rightPanelOpen ? null : (
                        <span className="text-[9px] font-bold text-white">{chip.label}</span>
                      )}
                    </div>
                    {rightPanelOpen && (
                      <span className="text-xs font-semibold text-text-primary">{chip.id}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
