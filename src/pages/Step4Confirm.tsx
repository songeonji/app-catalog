import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createRoot } from 'react-dom/client';
import { toJpeg, toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  ArrowLeft,
  ArrowDown,
  Check,
  DownloadSimple,
  PaperPlaneTilt,
  Spinner,
} from '@phosphor-icons/react';
import { useAppStore } from '../store';
import TopNav from '../components/TopNav';
import PhoneMockup from '../components/PhoneMockup';
import { getTemplateById } from '../data/templates';
import { sendToManager } from '../utils/sendToManager';
import type { ScreenTab } from '../types';

/** 추출할 전체 화면 목록 (오더 하위 화면 포함) */
const ALL_CAPTURE_SCREENS: { screen: ScreenTab; orderView?: string; label: string }[] = [
  { screen: 'home', label: '메인 홈' },
  { screen: 'order', orderView: 'store', label: '오더 — 매장선택' },
  { screen: 'order', orderView: 'menu', label: '오더 — 상품리스트' },
  { screen: 'order', orderView: 'detail', label: '오더 — 상세페이지' },
  { screen: 'order', orderView: 'cart', label: '오더 — 장바구니' },
  { screen: 'order', orderView: 'payment', label: '오더 — 결제' },
  { screen: 'coupon', label: '쿠폰함' },
  { screen: 'stamp', label: '스탬프' },
  { screen: 'news', label: '새소식' },
];

const FORMAT_OPTIONS = ['JPEG', 'PNG'] as const;
const RESOLUTION_OPTIONS = ['1x', '2x', '3x'] as const;

export default function Step4Confirm() {
  const {
    step,
    completedSteps,
    customize,
    setStep,
    setActiveScreen,
  } = useAppStore();

  const currentTemplate = customize.templateId
    ? getTemplateById(customize.templateId)
    : null;

  const [format, setFormat] = useState<string>('JPEG');
  const [resolution, setResolution] = useState<string>('2x');
  const [expandedSection, setExpandedSection] = useState<'image' | 'send' | null>(null);
  // 브랜드명: 전달 전용 로컬 state (모바일 UI와 무관)
  const [localBrandName, setLocalBrandName] = useState(customize.brandName || '');

  // 담당자 전달 state
  const [sendStatus, setSendStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  const [downloading, setDownloading] = useState(false);
  const offscreenRef = useRef<HTMLDivElement>(null);

  /** GA4 SPA page_view: 화면 진입 시 1회 */
  useEffect(() => {
    window.history.pushState({}, '', '/step4-confirm');
    document.title = 'STEP 04 확정·공유 · App Catalog';
  }, []);

  /** 오프스크린 PhoneMockup을 렌더링하고 이미지로 캡처 */
  const captureScreen = useCallback(
    async (screen: ScreenTab, orderViewParam?: string): Promise<Blob> => {
      const container = offscreenRef.current;
      if (!container) throw new Error('offscreen container not found');

      // 오프스크린 컨테이너에 PhoneMockup 렌더링
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      container.appendChild(wrapper);

      const scale = resolution === '3x' ? 3 : resolution === '2x' ? 2 : 1;

      const root = createRoot(wrapper);
      await new Promise<void>((resolve) => {
        root.render(
          <PhoneMockup
            templateId={customize.templateId || 'B-2'}
            brandColor={customize.brandColor}
            brandName={customize.brandName}
            bannerRatio={customize.bannerRatio}
            activeScreen={screen}
            showHeaderBI={customize.headerBI.type === 'image'}
            headerLogoUrl={customize.headerBI.url}
            fabIconUrl={customize.fabIconUrl}
            quickMenuOrder={customize.quickMenuOrder}
            orderView={orderViewParam}
          />,
        );
        // 렌더링 완료 대기
        setTimeout(resolve, 300);
      });

      const node = wrapper.firstElementChild as HTMLElement;
      if (!node) throw new Error('render failed');

      const captureOpts = {
        pixelRatio: scale,
        quality: 0.95,
        backgroundColor: '#ffffff',
      };

      let dataUrl: string;
      if (format === 'PNG') {
        dataUrl = await toPng(node, captureOpts);
      } else {
        dataUrl = await toJpeg(node, captureOpts);
      }

      root.unmount();
      container.removeChild(wrapper);

      // data URL → Blob
      const res = await fetch(dataUrl);
      return res.blob();
    },
    [customize, format, resolution],
  );

  const handleDownload = async () => {
    setDownloading(true);

    try {
      const ext = format === 'PNG' ? 'png' : 'jpg';
      const templateId = customize.templateId || 'B-2';
      const zip = new JSZip();

      for (const item of ALL_CAPTURE_SCREENS) {
        const blob = await captureScreen(item.screen, item.orderView);
        const fileName = item.orderView
          ? `${templateId}_order_${item.orderView}.${ext}`
          : `${templateId}_${item.screen}.${ext}`;
        zip.file(fileName, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${templateId}_all_screens.zip`);
    } catch (err) {
      console.error('Download failed:', err);
      alert('이미지 다운로드에 실패했습니다.');
    } finally {
      setDownloading(false);
    }
  };

  const [sending, setSending] = useState(false);

  const handleSendToManager = async () => {
    setSending(true);
    try {
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const result = await sendToManager({
        templateId: customize.templateId || '-',
        templateName: currentTemplate?.name || '-',
        brandColor: customize.brandColor,
        brandName: localBrandName,
        bannerRatio: customize.bannerRatio,
        date: dateStr,
      });

      if (result.success) {
        setSendStatus('sent');
      } else {
        setSendStatus('error');
        setTimeout(() => setSendStatus('idle'), 4000);
      }
    } catch {
      setSendStatus('error');
      setTimeout(() => setSendStatus('idle'), 4000);
    } finally {
      setSending(false);
    }
  };

  const handleBackToInteraction = () => {
    setStep(3);
  };

  const handleCompareOthers = () => {
    setActiveScreen('home');
    setStep(1);
  };

  const summaryRows = [
    {
      label: '시안',
      value: currentTemplate ? `${currentTemplate.id} ${currentTemplate.name}` : '-',
    },
    {
      label: '브랜드 컬러',
      value: customize.brandColor,
      colorDot: customize.brandColor,
    },
    {
      label: '브랜드명',
      value: localBrandName || '(미입력)',
    },
    {
      label: '배너 비율',
      value: customize.bannerRatio,
    },
  ];

  return (
    <div className="min-h-screen bg-warm-white">
      {/* 오프스크린 렌더링 컨테이너 (화면에 보이지 않음) */}
      <div ref={offscreenRef} className="fixed left-[-9999px] top-0 pointer-events-none" aria-hidden="true" />
      <TopNav currentStep={step} completedSteps={completedSteps} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="py-10 px-10 max-w-[1200px] mx-auto"
      >
        <div className="flex gap-12">
          {/* ── Left: Phone Mockup ── */}
          <div className="flex-1 flex flex-col items-center">
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
            {currentTemplate && (
              <div className="mt-4 flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentTemplate.gradient.from }}
                />
                <span className="text-sm font-medium text-text-secondary">
                  {currentTemplate.id} &middot; {currentTemplate.name}
                </span>
              </div>
            )}
          </div>

          {/* ── Right: Confirm Panel ── */}
          <div className="w-[480px] shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* Header */}
              <span className="text-primary text-xs font-semibold tracking-[0.08em]">
                STEP 04
              </span>
              <h1 className="text-[28px] font-extrabold text-text-primary mt-2 leading-tight tracking-tight">
                확정 및 공유
              </h1>
              <p className="text-text-secondary text-sm mt-2 mb-6">
                선택한 시안과 커스터마이즈 설정을 확정하고 공유하세요.
              </p>

              {/* ── 선택 내역 ── */}
              <div className="bg-white rounded-xl border border-border p-5 mb-4">
                <h3 className="text-sm font-bold text-text-primary mb-3">선택 내역</h3>
                <div className="flex flex-col gap-2.5">
                  {summaryRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-sm text-text-muted">{row.label}</span>
                      <div className="flex items-center gap-2">
                        {row.colorDot && (
                          <div
                            className="w-4 h-4 rounded-full border border-border"
                            style={{ backgroundColor: row.colorDot }}
                          />
                        )}
                        <span className="text-sm font-semibold text-text-primary">{row.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 이미지 추출 (클릭 시 펼침) ── */}
              <div className="bg-white rounded-xl border border-border mb-3 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'image' ? null : 'image')}
                  data-ga-event="select_content"
                  data-ga-param-content-type="accordion_toggle"
                  data-ga-param-item-id="image_export"
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-2">
                    <DownloadSimple size={18} className="text-primary" />
                    <span className="text-sm font-bold text-text-primary">이미지 추출</span>
                    <span className="text-[11px] text-text-muted">({ALL_CAPTURE_SCREENS.length}개 화면)</span>
                  </div>
                  <ArrowDown size={16} className={`text-text-muted transition-transform ${expandedSection === 'image' ? 'rotate-180' : ''}`} />
                </button>
                {expandedSection === 'image' && (
                  <div className="px-4 pb-4">
                    {/* 추출 대상 */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {ALL_CAPTURE_SCREENS.map((item) => (
                        <span key={item.label} className="px-2 py-0.5 rounded bg-primary-light text-primary text-[11px] font-medium">
                          {item.label}
                        </span>
                      ))}
                    </div>
                    {/* 포맷 + 해상도 */}
                    <div className="flex gap-3 mb-3">
                      <div className="flex-1">
                        <p className="text-[11px] text-text-muted mb-1">포맷</p>
                        <div className="flex bg-warm-white rounded-lg p-0.5">
                          {FORMAT_OPTIONS.map((f) => (
                            <button key={f} type="button" onClick={() => setFormat(f)}
                              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${format === f ? 'bg-primary text-white' : 'text-text-secondary'}`}
                            >{f}</button>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-text-muted mb-1">해상도</p>
                        <div className="flex bg-warm-white rounded-lg p-0.5">
                          {RESOLUTION_OPTIONS.map((r) => (
                            <button key={r} type="button" onClick={() => setResolution(r)}
                              className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${resolution === r ? 'bg-primary text-white' : 'text-text-secondary'}`}
                            >{r}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={handleDownload} disabled={downloading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-40"
                    >
                      {downloading ? <Spinner size={16} className="animate-spin" /> : <DownloadSimple size={16} weight="bold" />}
                      {downloading ? '다운로드 중...' : '다운로드'}
                    </button>
                  </div>
                )}
              </div>

              {/* ── 담당자 전달 (클릭 시 펼침) ── */}
              <div className="bg-white rounded-xl border border-border mb-4 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedSection(expandedSection === 'send' ? null : 'send')}
                  data-ga-event="select_content"
                  data-ga-param-content-type="accordion_toggle"
                  data-ga-param-item-id="manager_send"
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-2">
                    <PaperPlaneTilt size={18} weight="fill" className="text-dark" />
                    <span className="text-sm font-bold text-text-primary">담당자에게 전달</span>
                  </div>
                  <ArrowDown size={16} className={`text-text-muted transition-transform ${expandedSection === 'send' ? 'rotate-180' : ''}`} />
                </button>
                {expandedSection === 'send' && (
                  <div className="px-4 pb-4">
                    {/* 브랜드명 필수 입력 */}
                    <div className="mb-3">
                      <label className="text-[11px] text-text-muted block mb-1">
                        브랜드명 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={localBrandName}
                        onChange={(e) => setLocalBrandName(e.target.value)}
                        placeholder="브랜드명을 입력해주세요"
                        className={`w-full border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none transition-colors ${
                          localBrandName.trim() ? 'border-border focus:border-primary' : 'border-red-300 bg-red-50/30'
                        }`}
                      />
                    </div>
                    <button type="button" onClick={handleSendToManager}
                      disabled={sending || !localBrandName.trim() || sendStatus === 'sent'}
                      data-ga-event="share"
                      data-ga-param-method="manager"
                      data-ga-param-content-type="template"
                      data-ga-param-item-id={customize.templateId || '-'}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-dark text-white text-sm font-bold hover:bg-dark-hover transition-colors disabled:opacity-40"
                    >
                      {sending ? <Spinner size={16} className="animate-spin" /> : sendStatus === 'sent' ? <Check size={16} weight="bold" /> : <PaperPlaneTilt size={16} weight="fill" />}
                      {sending ? '전달 중...' : sendStatus === 'sent' ? '전달 완료' : '전달하기'}
                    </button>
                  </div>
                )}
              </div>

              {/* 토스트 메시지 */}
              {sendStatus === 'sent' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-4"
                >
                  <Check size={16} weight="bold" className="text-green-600" />
                  <span className="text-sm text-green-700 font-medium">전달이 완료되었습니다.</span>
                </motion.div>
              )}
              {sendStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-4"
                >
                  <span className="text-sm text-red-600 font-medium">전달에 실패했습니다. 담당자에게 문의해주세요.</span>
                </motion.div>
              )}

              {/* ── 하단 버튼 ── */}
              <div className="flex flex-col gap-2 mt-2">
                <button
                  type="button"
                  onClick={handleBackToInteraction}
                  data-ga-event="select_content"
                  data-ga-param-content-type="step_back"
                  data-ga-param-item-id="step4_to_step3"
                  data-ga-param-item-category="back_link"
                  className="flex items-center gap-1.5 text-sm text-text-muted hover:text-primary transition-colors"
                >
                  <ArrowLeft size={14} />
                  인터랙션 체험으로 돌아가기
                </button>
                <button
                  type="button"
                  onClick={handleCompareOthers}
                  data-ga-event="select_content"
                  data-ga-param-content-type="step_back"
                  data-ga-param-item-id="step4_to_step1"
                  data-ga-param-item-category="back_link"
                  data-ga-param-item-category2="compare_others"
                  className="w-full py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-white transition-colors"
                >
                  다른 시안 비교하기
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
