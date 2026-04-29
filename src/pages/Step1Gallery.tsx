import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';
import { useAppStore } from '../store';
import TopNav from '../components/TopNav';
import BottomCTA from '../components/BottomCTA';
import SectionHeader from '../components/SectionHeader';
import TemplateCard from '../components/TemplateCard';
import { sections, getTemplatesBySection } from '../data/templates';
import type { SectionId, TemplateId } from '../types';

const SECTION_GRID_COLS: Record<SectionId, string> = {
  A: 'grid-cols-2',
  B: 'grid-cols-3',
  C: 'grid-cols-4',
  D: 'grid-cols-2',
};

export default function Step1Gallery() {
  const {
    step,
    completedSteps,
    customize,
    setTemplateId,
    setMode,
    completeStep,
    setStep,
  } = useAppStore();

  /** GA4 SPA page_view: 화면 진입 시 1회 */
  useEffect(() => {
    window.history.pushState({}, '', '/step1-gallery');
    document.title = 'STEP 01 전체 시안 · App Catalog';
  }, []);

  const handleSelectTemplate = (id: TemplateId) => {
    setTemplateId(id);
  };

  const handleStart = () => {
    if (customize.templateId) {
      completeStep(1);
      setStep(2);
    }
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
        <div className="mb-10">
          <span className="text-primary text-sm font-bold tracking-widest">
            STEP 01
          </span>
          <h1 className="text-[32px] font-bold text-text-primary mt-2 leading-tight">
            시안을 선택하세요
          </h1>
          <p className="text-text-secondary mt-2">
            다양한 레이아웃과 구조의 시안을 살펴보고, 매장에 맞는 시안을 직접
            선택하세요.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-10">
          {sections.map((section, sIdx) => {
            const sectionTemplates = getTemplatesBySection(section.id);
            const gridCols = SECTION_GRID_COLS[section.id];

            return (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sIdx * 0.1, duration: 0.4 }}
              >
                <SectionHeader section={section} />
                <div className={`grid ${gridCols} gap-5 mt-4`}>
                  {sectionTemplates.map((tpl) => (
                    <div
                      key={tpl.id}
                      data-ga-event="select_content"
                      data-ga-param-content-type="template"
                      data-ga-param-item-id={tpl.id}
                      data-ga-param-item-name={tpl.name}
                      data-ga-param-item-category="gallery"
                    >
                      <TemplateCard
                        template={tpl}
                        selected={customize.templateId === tpl.id}
                        onClick={() => handleSelectTemplate(tpl.id)}
                      />
                    </div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </motion.div>

      <BottomCTA
        leftContent={
          <button
            type="button"
            onClick={() => setMode('recommend')}
            data-ga-event="select_content"
            data-ga-param-content-type="mode_switch"
            data-ga-param-item-id="to_recommend"
            className="text-sm text-text-secondary hover:text-primary transition-colors"
          >
            브랜드 맞춤 시안 추천받기{' '}
            <ArrowRight size={14} className="inline" />
          </button>
        }
        primaryLabel="커스터마이즈 시작"
        primaryDisabled={!customize.templateId}
        onPrimaryClick={handleStart}
        primaryDataAttrs={{
          'data-ga-event': 'select_content',
          'data-ga-param-content-type': 'step_progress',
          'data-ga-param-item-id': 'step1_to_step2',
          'data-ga-param-item-category': 'bottom_cta',
        }}
      />
    </div>
  );
}
