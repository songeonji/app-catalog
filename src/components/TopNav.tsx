import { SquaresFour, Check } from '@phosphor-icons/react';
import type { Step } from '../types';

const STEPS: { step: Step; label: string }[] = [
  { step: 1, label: '시안 선택' },
  { step: 2, label: '커스터마이즈' },
  { step: 3, label: '인터랙션 체험' },
  { step: 4, label: '확정 · 공유' },
];

interface TopNavProps {
  currentStep: number;
  completedSteps: Set<number>;
}

export function TopNav({ currentStep, completedSteps }: TopNavProps) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white border-b border-border px-10 py-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <SquaresFour size={24} weight="fill" className="text-primary" />
        <span className="font-bold text-[16px] tracking-tight text-text-primary">
          App Catalog
        </span>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        {STEPS.map(({ step, label }, index) => {
          const isCompleted = completedSteps.has(step);
          const isCurrent = currentStep === step;
          const isLocked = !isCompleted && !isCurrent;

          return (
            <div key={step} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-text-disabled text-sm select-none">›</span>
              )}
              <button
                type="button"
                disabled={isLocked}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  isCompleted
                    ? 'text-primary cursor-pointer hover:underline'
                    : isCurrent
                      ? 'text-primary font-semibold cursor-default'
                      : 'text-text-disabled cursor-not-allowed'
                }`}
              >
                {isCompleted && <Check size={14} weight="bold" />}
                <span>{label}</span>
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

export default TopNav;
