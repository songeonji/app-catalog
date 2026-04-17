import type { ReactNode } from 'react';
import { CaretRight } from '@phosphor-icons/react';

interface BottomCTAProps {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  primaryLabel: string;
  primaryDisabled?: boolean;
  onPrimaryClick: () => void;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
}

export function BottomCTA({
  leftContent,
  rightContent,
  primaryLabel,
  primaryDisabled = false,
  onPrimaryClick,
  secondaryLabel,
  onSecondaryClick,
}: BottomCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-t border-border px-10 py-4">
      {/* Left content area */}
      <div className="flex items-center">{leftContent}</div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {rightContent}

        {secondaryLabel && onSecondaryClick && (
          <button
            type="button"
            onClick={onSecondaryClick}
            className="border border-border rounded-lg px-7 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-warm-white"
          >
            {secondaryLabel}
          </button>
        )}

        <button
          type="button"
          disabled={primaryDisabled}
          onClick={onPrimaryClick}
          className={`flex items-center gap-2 rounded-lg px-7 py-3 text-sm font-medium text-white transition-colors ${
            primaryDisabled
              ? 'bg-text-disabled cursor-not-allowed'
              : 'bg-primary hover:bg-primary-hover cursor-pointer'
          }`}
        >
          <span>{primaryLabel}</span>
          <CaretRight size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}

export default BottomCTA;
