import type { Section, SectionId } from '../types';

interface SectionHeaderProps {
  section: Section;
}

const SECTION_BADGE_STYLES: Record<SectionId, string> = {
  A: 'bg-section-a text-white',
  B: 'bg-section-b text-white',
  C: 'bg-section-c text-white',
  D: 'bg-section-d text-white',
};

export function SectionHeader({ section }: SectionHeaderProps) {
  const badgeStyle = SECTION_BADGE_STYLES[section.id];

  return (
    <div className="flex items-center gap-3 py-2">
      {/* Section badge */}
      <div
        className={`w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold shrink-0 ${badgeStyle}`}
      >
        {section.id}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <h2 className="text-[20px] font-bold tracking-tight text-text-primary leading-tight">
          {section.name}
        </h2>
        <p className="text-sm text-text-muted mt-0.5">{section.description}</p>
      </div>
    </div>
  );
}

export default SectionHeader;
