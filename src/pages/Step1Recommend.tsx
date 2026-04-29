import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Buildings,
  House,
  ShoppingBag,
  Car,
  HeartStraight,
  Lightning,
  Ticket,
  Storefront,
  Truck,
  Timer,
  Monitor,
  CheckCircle,
  Circle,
  ArrowsClockwise,
  Check,
  CaretRight,
  CaretDown,
  Prohibit,
  Warning,
  Star,
  Square,
  CheckSquare,
} from '@phosphor-icons/react';
import { useAppStore } from '../store';
import TopNav from '../components/TopNav';
import BottomCTA from '../components/BottomCTA';
import { TemplatePreview } from '../components/TemplatePreview';
import { allQuestions } from '../data/questions';
import { getRecommendation } from '../data/recommendation';
import { getTemplateById } from '../data/templates';
import type { TemplateId } from '../types';

type QuestionKey = 'q1' | 'q2' | 'q3' | 'q3_1';

/** Q1 아이콘: 오피스, 주거, 쇼핑몰, 로드샵 */
const Q1_ICONS = [Buildings, House, ShoppingBag, Car];
/** Q2 아이콘: 재방문·단골(♥), 빠른주문(⚡), 이벤트(🎟) */
const Q2_ICONS = [HeartStraight, Lightning, Ticket];
/** Q3 아이콘: 포장만, 배달+포장 */
const Q3_ICONS = [Storefront, Truck];
/** Q3-1 아이콘: 첫화면선택, 주문할때선택 */
const Q3_1_ICONS = [Timer, Monitor];

function getIconsForQuestion(qKey: QuestionKey) {
  switch (qKey) {
    case 'q1': return Q1_ICONS;
    case 'q2': return Q2_ICONS;
    case 'q3': return Q3_ICONS;
    case 'q3_1': return Q3_1_ICONS;
    default: return Q1_ICONS;
  }
}

/* ── 섹션별 색상 유틸 ── */
const sectionStyleMap: Record<string, { text: string; bg: string }> = {
  A: { text: 'text-[#E07850]', bg: 'bg-[#FFF5F0]' },
  B: { text: 'text-primary', bg: 'bg-primary-light' },
  C: { text: 'text-[#3A9E5C]', bg: 'bg-[#F0FFF5]' },
  D: { text: 'text-[#7B4FD8]', bg: 'bg-[#F5F0FF]' },
};

/**
 * 비추천 카드 타이틀에 표시할 템플릿 ID 문자열 포맷.
 *  - 1~3종: `A-2`, `C-3 / C-4` 등 그대로 나열
 *  - 4종 이상: 섹션별 계열로 축약 (예: "B-1 / B-2 / B-3 → B계열")
 */
function formatTemplateIdList(ids: TemplateId[]): string {
  if (ids.length <= 3) return ids.join(' / ');
  const bySection = new Map<string, TemplateId[]>();
  for (const id of ids) {
    const sec = id.split('-')[0];
    if (!bySection.has(sec)) bySection.set(sec, []);
    bySection.get(sec)!.push(id);
  }
  const parts: string[] = [];
  for (const [sec, list] of bySection) {
    // 해당 섹션 시안을 3개 이상 포함하면 "계열"로 축약
    if (list.length >= 3) parts.push(`${sec}계열 전체`);
    else parts.push(list.join(' / '));
  }
  return parts.join(', ');
}

/* ================================================================
   메인 컴포넌트
   ================================================================ */
export default function Step1Recommend() {
  const {
    step,
    completedSteps,
    recommendAnswers,
    setRecommendAnswer,
    setMode,
    setStep,
    completeStep,
    setTemplateId,
  } = useAppStore();

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  /** 기획서 v2.1: 비추천 섹션은 기본값 펼침 */
  const [isNotRecOpen, setIsNotRecOpen] = useState(true);

  /**
   * 동적 플로우:
   *  - 기본: Q1 → Q2 → Q3
   *  - Q1 = 로드샵·외곽(value 3): Q2 스킵 → Q1 → Q3
   *  - Q3 = 예(value 1): 끝에 Q3-1 추가
   */
  const effectiveFlow = useMemo(() => {
    const flow: QuestionKey[] = ['q1'];
    if (recommendAnswers.q1 !== 3) {
      flow.push('q2');
    }
    flow.push('q3');
    if (recommendAnswers.q3 === 1) {
      flow.push('q3_1');
    }
    return flow;
  }, [recommendAnswers.q1, recommendAnswers.q3]);

  const totalSteps = effectiveFlow.length;
  const currentQKey = effectiveFlow[currentQIndex];
  const currentQuestion = allQuestions[currentQKey];
  const currentAnswer = recommendAnswers[currentQKey];
  const icons = getIconsForQuestion(currentQKey);

  const recommendation = useMemo(
    () => getRecommendation(recommendAnswers),
    [recommendAnswers],
  );

  /** GA4 SPA page_view: showResults 분기에 따라 가상 페이지 갱신 */
  useEffect(() => {
    const path = showResults ? '/step1-recommend-result' : '/step1-recommend-qa';
    const title = showResults
      ? 'STEP 01 추천 결과 · App Catalog'
      : 'STEP 01 추천 모드 · App Catalog';
    window.history.pushState({}, '', path);
    document.title = title;
  }, [showResults]);

  const handleNext = () => {
    if (currentQIndex < totalSteps - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleSelectAndGo = (id: TemplateId) => {
    setTemplateId(id);
    completeStep(1);
    setStep(2);
  };

  const handleRestart = () => {
    setRecommendAnswer('q1', null);
    setRecommendAnswer('q2', []);
    setRecommendAnswer('q3', null);
    setRecommendAnswer('q3_1', null);
    setCurrentQIndex(0);
    setShowResults(false);
  };

  /** Q2 복수 선택 토글 */
  const toggleQ2 = (value: number) => {
    const current = recommendAnswers.q2;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setRecommendAnswer('q2', next);
  };

  // 프로그레스 표시용 (1-based, 가변 단계)
  const displayStep = currentQIndex + 1;

  /* ── 추천 결과 화면 (기획서: "브랜드에 딱 맞는 시안을 찾았어요") ── */
  if (showResults) {
    const bestTpl = recommendation.primary
      ? getTemplateById(recommendation.primary)
      : null;
    const altTpls = recommendation.closeRecs
      .map(getTemplateById)
      .filter(Boolean);
    const notRecItems = recommendation.notRecommended;

    return (
      <div className="min-h-screen flex flex-col">
        <TopNav currentStep={step} completedSteps={completedSteps} />

        <div className="flex-1 flex flex-col items-center px-10 pt-12 pb-8">
          {/* Hero */}
          <span className="text-primary text-xs font-semibold tracking-[0.08em]">
            STEP 01
          </span>
          <h1 className="text-4xl font-extrabold text-text-primary mt-3 tracking-tight leading-[44px]">
            브랜드에 딱 맞는 시안을 찾았어요
          </h1>
          <p className="text-text-muted mt-3 text-base">
            응답 결과를 기반으로 가장 적합한 시안을 추천합니다.
          </p>

          {/* ── 추천 시안 (가장 잘 맞아요) ── */}
          {bestTpl && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-[1040px] mt-10 rounded-xl border-2 border-primary overflow-hidden"
            >
              {/* 헤더 배지 */}
              <div className="flex items-center gap-2 px-5 py-3 bg-primary">
                <Star size={16} weight="fill" className="text-white" />
                <span className="text-white text-sm font-bold">
                  가장 잘 맞아요
                </span>
              </div>
              {/* 내용 */}
              <div className="flex gap-6 p-6 bg-white">
                {/* 썸네일 — 시안별 실제 미니 UI */}
                <div
                  className="w-40 h-[280px] rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${bestTpl.gradient.from}, ${bestTpl.gradient.to})`,
                  }}
                >
                  <TemplatePreview
                    template={bestTpl}
                    variant="floating"
                    scale={1.15}
                  />
                </div>
                {/* 정보 */}
                <div className="flex flex-col gap-4 flex-1 py-1">
                  <div className="flex items-center gap-3">
                    <span className="font-['Inter'] text-2xl font-extrabold text-text-primary tracking-tight">
                      {bestTpl.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                        sectionStyleMap[bestTpl.section]?.bg ?? ''
                      } ${sectionStyleMap[bestTpl.section]?.text ?? ''}`}
                    >
                      {bestTpl.type}
                    </span>
                  </div>
                  <p className="text-[15px] text-text-secondary leading-6">
                    {bestTpl.description}
                  </p>
                  <div className="pt-3 border-t border-border-light">
                    <button
                      type="button"
                      onClick={() => handleSelectAndGo(bestTpl.id)}
                      data-ga-event="select_content"
                      data-ga-param-content-type="template"
                      data-ga-param-item-id={bestTpl.id}
                      data-ga-param-item-name={bestTpl.name}
                      data-ga-param-item-category="recommend_primary"
                      className="flex items-center gap-1.5 px-7 py-3 rounded-lg bg-dark text-white text-[15px] font-semibold hover:bg-dark-hover transition-colors"
                    >
                      이 시안으로 시작하기
                      <CaretRight size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── 근접 추천 (추천해요) ── */}
          {altTpls.length > 0 && (
            <div className="w-full max-w-[1040px] mt-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle
                  size={16}
                  weight="fill"
                  className="text-primary"
                />
                <p className="text-sm font-bold text-text-primary tracking-wide">
                  추천해요
                </p>
              </div>
              <div className="flex gap-5">
                {altTpls.map((tpl) =>
                  tpl ? (
                    <motion.div
                      key={tpl.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                      className="flex-1 rounded-xl border border-primary/30 bg-primary-light/30 overflow-hidden"
                    >
                      <div className="flex gap-4 p-5">
                        <div
                          className="w-[104px] h-[140px] rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${tpl.gradient.from}33, ${tpl.gradient.to}33)`,
                          }}
                        >
                          <TemplatePreview
                            template={tpl}
                            variant="floating"
                            scale={0.75}
                          />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-['Inter'] text-lg font-extrabold text-text-primary tracking-tight">
                              {tpl.id}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                sectionStyleMap[tpl.section]?.bg ?? ''
                              } ${sectionStyleMap[tpl.section]?.text ?? ''}`}
                            >
                              {tpl.type}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary leading-5">
                            {tpl.description}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleSelectAndGo(tpl.id)}
                            data-ga-event="select_content"
                            data-ga-param-content-type="template"
                            data-ga-param-item-id={tpl.id}
                            data-ga-param-item-name={tpl.name}
                            data-ga-param-item-category="recommend_close"
                            className="self-start mt-1 px-5 py-2.5 rounded-lg border border-primary/40 bg-white text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-colors"
                          >
                            이 시안으로 시작하기
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : null,
                )}
              </div>
            </div>
          )}

          {/* ── 비추천 섹션 (이 시안들은 맞지 않아요, 기본값 펼침) ── */}
          {notRecItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="w-full max-w-[1040px] mt-8 rounded-xl border border-[#E85A5A]/35 bg-[#FFF7F7] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setIsNotRecOpen((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-[#FEECEC] hover:bg-[#FCE0E0] transition-colors"
                aria-expanded={isNotRecOpen}
              >
                <div className="flex items-center gap-2">
                  <Prohibit
                    size={18}
                    weight="bold"
                    className="text-[#C83B3B]"
                  />
                  <span className="text-[#9A2B2B] text-sm font-bold">
                    이 시안들은 맞지 않아요
                  </span>
                  <span className="text-[#C83B3B]/70 text-xs font-medium ml-1">
                    ({notRecItems.length}건)
                  </span>
                </div>
                <CaretDown
                  size={14}
                  weight="bold"
                  className={`text-[#C83B3B] transition-transform ${
                    isNotRecOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isNotRecOpen && (
                  <motion.div
                    key="notrec-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pt-4 pb-5">
                      <div className="flex items-start gap-2 mb-4 px-1">
                        <Warning
                          size={14}
                          weight="fill"
                          className="text-[#C83B3B] shrink-0 mt-0.5"
                        />
                        <p className="text-[12.5px] text-[#7A2F2F] leading-5">
                          선택한 상권·타겟층에서 역효과가 날 수 있는 시안이에요.
                          선택 전에 한 번 확인해 주세요.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {notRecItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg bg-white border border-[#E85A5A]/30 p-4 shadow-[0_1px_0_rgba(200,59,59,0.06)]"
                          >
                            <div className="flex items-center gap-2 mb-2.5">
                              <div className="w-5 h-5 rounded-full bg-[#FEECEC] flex items-center justify-center">
                                <Prohibit
                                  size={11}
                                  weight="bold"
                                  className="text-[#C83B3B]"
                                />
                              </div>
                              <span className="font-['Inter'] text-[15px] font-extrabold text-[#9A2B2B] tracking-tight">
                                {formatTemplateIdList(item.templateIds)}
                              </span>
                            </div>
                            <p className="text-[13px] text-text-secondary leading-[21px]">
                              {item.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── 하단 액션 (다시 응답하기 + 전체 시안 직접 보기) ── */}
          <div className="flex items-center gap-6 mt-8">
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-border text-sm font-semibold text-text-primary hover:border-primary/40 transition-colors"
            >
              <ArrowsClockwise size={16} />
              다시 응답하기
            </button>
            <button
              type="button"
              onClick={() => setMode('gallery')}
              className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary-hover transition-colors"
            >
              전체 시안 직접 보기 →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Q&A 질문 화면 ── */
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav currentStep={step} completedSteps={completedSteps} />

      <div className="flex-1 flex flex-col items-center px-10 pt-14 pb-28">
        {/* Hero */}
        <span className="text-primary text-xs font-semibold tracking-[0.08em]">
          STEP 01
        </span>
        <h1 className="text-4xl font-extrabold text-text-primary mt-3 tracking-tight leading-[44px]">
          매장 정보를 알려주세요
        </h1>
        <p className="text-text-muted mt-3 text-base">
          상권과 주 고객층을 알려주시면 가장 잘 맞는 시안을 추천해드려요.
        </p>

        {/* 프로그레스 (가변 단계) */}
        <div className="flex items-center mt-10 mb-10">
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const n = idx + 1;
            return (
              <div key={n} className="flex items-center">
                {idx > 0 && (
                  <div
                    className={`w-[120px] h-[2px] ${
                      displayStep > idx ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    displayStep >= n
                      ? 'bg-primary text-white'
                      : 'bg-warm-white border-[1.5px] border-border text-text-disabled'
                  }`}
                >
                  {displayStep > n ? <Check size={14} weight="bold" /> : n}
                </div>
              </div>
            );
          })}
        </div>

        {/* 질문 카드 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQKey}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-[960px]"
          >
            <h2 className="text-xl font-bold text-text-primary mb-2 leading-7">
              Q{currentQIndex + 1}. {currentQuestion.title}
            </h2>
            {currentQuestion.subtitle && (
              <p className="text-sm text-text-muted mb-5">
                {currentQuestion.subtitle}
              </p>
            )}
            {!currentQuestion.subtitle && <div className="mb-5" />}

            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, idx) => {
                const isMulti = currentQKey === 'q2';
                const q2Set = isMulti
                  ? (recommendAnswers.q2 as number[])
                  : [];
                const isSelected = isMulti
                  ? q2Set.includes(option.value)
                  : currentAnswer === option.value;
                const Icon = icons[idx] || Circle;

                const handleClick = () => {
                  if (isMulti) {
                    toggleQ2(option.value);
                  } else {
                    setRecommendAnswer(
                      currentQKey as 'q1' | 'q3' | 'q3_1',
                      option.value,
                    );
                  }
                };

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={handleClick}
                    data-ga-event="select_content"
                    data-ga-param-content-type="recommend_answer"
                    data-ga-param-item-id={`${currentQKey}_${option.value}`}
                    data-ga-param-item-name={option.label}
                    className={`flex items-center gap-4 px-6 py-[18px] rounded-xl border-[1.5px] transition-all text-left ${
                      isSelected
                        ? 'bg-primary-light border-primary'
                        : 'bg-white border-border hover:border-primary/30'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-primary' : 'bg-warm-white'
                      }`}
                    >
                      <Icon
                        size={20}
                        weight="fill"
                        className={isSelected ? 'text-white' : 'text-text-muted'}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold leading-6 text-text-primary">
                        {option.label}
                      </p>
                      {option.description && (
                        <p className="text-[13px] text-text-muted mt-0.5">
                          {option.description}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      {isMulti ? (
                        isSelected ? (
                          <CheckSquare
                            size={24}
                            weight="fill"
                            className="text-primary"
                          />
                        ) : (
                          <Square size={24} className="text-border" />
                        )
                      ) : isSelected ? (
                        <CheckCircle
                          size={24}
                          weight="fill"
                          className="text-primary"
                        />
                      ) : (
                        <Circle size={24} className="text-border" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomCTA
        leftContent={
          <button
            type="button"
            onClick={() => setMode('gallery')}
            className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary-hover transition-colors"
          >
            전체 시안 직접 보기 →
          </button>
        }
        primaryLabel="다음 질문"
        primaryDisabled={
          // Q2(복수 선택)는 아무것도 선택 안 해도 "그냥 다음으로" 진행 가능
          currentQKey === 'q2' ? false : currentAnswer === null
        }
        onPrimaryClick={handleNext}
      />
    </div>
  );
}
