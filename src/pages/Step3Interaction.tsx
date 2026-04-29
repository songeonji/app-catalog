import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowsLeftRight,
  Tabs,
  GridFour,
  ArrowLeft,
} from '@phosphor-icons/react';
import { useAppStore } from '../store';
import TopNav from '../components/TopNav';
import BottomCTA from '../components/BottomCTA';
import PhoneMockup from '../components/PhoneMockup';
import { trackEvent } from '../utils/analytics';
import type { ScreenTab } from '../types';

const SCREEN_TABS: { key: ScreenTab; label: string }[] = [
  { key: 'home', label: '메인 홈' },
  { key: 'order', label: '오더' },
  { key: 'coupon', label: '쿠폰함' },
  { key: 'stamp', label: '스탬프' },
  { key: 'news', label: '새소식' },
];

const SCREEN_INFO: Record<
  ScreenTab,
  { title: string; description: string }
> = {
  home: {
    title: '메인 홈',
    description:
      '브랜드의 첫인상을 결정하는 메인 화면입니다. 배너, 퀵메뉴, 추천 메뉴 등 주요 요소가 배치됩니다.',
  },
  order: {
    title: '오더',
    description:
      '메뉴 탐색부터 장바구니, 결제까지 이어지는 주문 화면입니다. 카테고리별 메뉴 구성을 확인하세요.',
  },
  coupon: {
    title: '쿠폰함',
    description:
      '보유 쿠폰 확인, 쿠폰 다운로드, 사용 히스토리를 관리하는 화면입니다.',
  },
  stamp: {
    title: '스탬프',
    description:
      '스탬프 카드 목록과 적립 현황을 확인하고, 상세 내역을 볼 수 있습니다.',
  },
  news: {
    title: '새소식',
    description:
      '공지사항, 이벤트, 프로모션 등 브랜드 소식을 전달하는 화면입니다.',
  },
};

const INTERACTIONS = [
  {
    icon: ArrowsLeftRight,
    label: '배너 좌우 스와이프',
    description: '메인 배너를 좌우로 넘겨보세요',
  },
  {
    icon: Tabs,
    label: '하단 탭 전환',
    description: '하단 내비게이션 탭을 전환해 보세요',
  },
  {
    icon: GridFour,
    label: '퀵메뉴 탭 이동',
    description: '퀵메뉴 아이콘을 탭하여 이동해 보세요',
  },
];

export default function Step3Interaction() {
  const {
    step,
    completedSteps,
    customize,
    setActiveScreen,
    completeStep,
    setStep,
  } = useAppStore();

  const currentScreen = customize.activeScreen;
  const screenInfo = SCREEN_INFO[currentScreen];

  /** GA4 SPA page_view: 화면 진입 시 1회 */
  useEffect(() => {
    window.history.pushState({}, '', '/step3-interaction');
    document.title = 'STEP 03 인터랙션 체험 · App Catalog';
  }, []);

  const handleConfirm = () => {
    setActiveScreen('home');
    completeStep(3);
    setStep(4);
  };

  const handleBack = () => {
    setActiveScreen('home');
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-warm-white">
      <TopNav currentStep={step} completedSteps={completedSteps} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="pt-24 pb-28 px-10 max-w-[1200px] mx-auto"
      >
        {/* Hero */}
        <div className="mb-8">
          <span className="text-primary text-sm font-bold tracking-widest">
            STEP 03
          </span>
          <h1 className="text-[32px] font-bold text-text-primary mt-2 leading-tight">
            화면 인터랙션 체험
          </h1>
          <p className="text-text-secondary mt-2">
            각 화면의 인터랙션을 직접 체험하고, 최종 확정 전에 확인하세요.
          </p>
        </div>

        {/* Screen tabs */}
        <div className="flex items-center gap-2 mb-10">
          {SCREEN_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveScreen(tab.key)}
              data-ga-event="select_content"
              data-ga-param-content-type="screen_tab"
              data-ga-param-item-id={tab.key}
              data-ga-param-item-category="tab_button"
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                currentScreen === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-text-secondary hover:border-primary/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="flex gap-10">
          {/* Left - info panel */}
          <div className="w-[280px] shrink-0">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-bold text-text-primary mb-2">
                {screenInfo.title}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-8">
                {screenInfo.description}
              </p>

              <h3 className="text-sm font-bold text-text-primary mb-4">
                체험 가능한 인터랙션
              </h3>
              <div className="flex flex-col gap-3">
                {INTERACTIONS.map(({ icon: Icon, label, description }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white border border-border"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {label}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right - Phone mockup */}
          <div className="flex-1 flex justify-center">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
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
                onScreenChange={(screen) => {
                  setActiveScreen(screen as import('../types').ScreenTab);
                  trackEvent('select_content', {
                    content_type: 'screen_tab',
                    item_id: screen,
                    item_category: 'mockup_action',
                  });
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <BottomCTA
        primaryLabel="시안 확정하기"
        onPrimaryClick={handleConfirm}
        secondaryLabel="커스터마이즈로 돌아가기"
        onSecondaryClick={handleBack}
        primaryDataAttrs={{
          'data-ga-event': 'select_content',
          'data-ga-param-content-type': 'step_progress',
          'data-ga-param-item-id': 'step3_to_step4',
          'data-ga-param-item-category': 'bottom_cta',
        }}
        secondaryDataAttrs={{
          'data-ga-event': 'select_content',
          'data-ga-param-content-type': 'step_back',
          'data-ga-param-item-id': 'step3_to_step2',
          'data-ga-param-item-category': 'bottom_cta',
        }}
        leftContent={
          <button
            type="button"
            onClick={handleBack}
            data-ga-event="select_content"
            data-ga-param-content-type="step_back"
            data-ga-param-item-id="step3_to_step2"
            data-ga-param-item-category="back_link"
            className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            이전 단계
          </button>
        }
      />
    </div>
  );
}
