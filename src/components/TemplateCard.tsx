import { Check, Star } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import type { Template, SectionId } from '../types';
import { TemplatePreview } from './TemplatePreview';

interface TemplateCardProps {
  template: Template;
  selected: boolean;
  onClick: () => void;
  showRecommendBadge?: boolean;
}

const SECTION_COLORS: Record<SectionId, { text: string; bg: string }> = {
  A: { text: 'text-section-a', bg: 'bg-section-a-bg' },
  B: { text: 'text-section-b', bg: 'bg-section-b-bg' },
  C: { text: 'text-section-c', bg: 'bg-section-c-bg' },
  D: { text: 'text-section-d', bg: 'bg-section-d-bg' },
};

export function TemplateCard({
  template,
  selected,
  onClick,
  showRecommendBadge = false,
}: TemplateCardProps) {
  const sectionColor = SECTION_COLORS[template.section];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`relative flex flex-col rounded-xl overflow-hidden bg-white text-left transition-shadow cursor-pointer ${
        selected
          ? 'border-2 border-primary ring-4 ring-primary/10 shadow-md'
          : 'border border-border hover:shadow-lg'
      }`}
    >
      {/* Selected check overlay */}
      {selected && (
        <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow">
          <Check size={16} weight="bold" className="text-white" />
        </div>
      )}

      {/* Recommend badge */}
      {showRecommendBadge && (
        <div className="absolute top-3 left-3 z-10 bg-primary text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
          추천
        </div>
      )}

      {/* Thumbnail area */}
      <div
        className="relative h-48 flex items-end justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${template.gradient.from}, ${template.gradient.to})`,
        }}
      >
        {/* Mini phone preview */}
        <TemplatePreview template={template} />
      </div>

      {/* Content area */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        {/* Template code + type tag */}
        <div className="flex items-center gap-2">
          <span className="font-mono font-extrabold text-base tracking-tight text-text-primary">
            {template.id}
          </span>
          <span
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${sectionColor.bg} ${sectionColor.text}`}
          >
            {template.type}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {template.description}
        </p>

        {/* Recommendation */}
        {template.recommendation && (
          <div className="flex items-start gap-1.5 mt-auto pt-2">
            <Star size={14} weight="fill" className="text-primary shrink-0 mt-0.5" />
            <span className="text-xs text-text-muted leading-snug">
              {template.recommendation}
            </span>
          </div>
        )}
      </div>
    </motion.button>
  );
}

export default TemplateCard;
