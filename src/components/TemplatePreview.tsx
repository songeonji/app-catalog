import type { Template, TemplateId } from '../types';

interface TemplatePreviewProps {
  template: Template;
  /**
   * rising(기본): 썸네일 영역 바닥에서 살짝 올라온 모양 (갤러리 카드용)
   * floating: 완전한 폰 형태로 배치 (추천 결과 카드용)
   */
  variant?: 'rising' | 'floating';
  /** 크기 스케일 (기본 1.0). 추천 결과 메인 카드 등에서 확대/축소용 */
  scale?: number;
}

/**
 * 시안별 mini UI preview.
 * - A계열: GNB 하단 탭바 강조
 * - B계열: FAB 플로팅 버튼 강조
 * - C계열: 타일메뉴 variants
 * - D계열: 배달/포장 카드 강조
 */
export function TemplatePreview({
  template,
  variant = 'rising',
  scale = 1,
}: TemplatePreviewProps) {
  const brand = template.gradient.from;
  const isFloating = variant === 'floating';

  return (
    <div
      className={`relative w-[118px] h-[160px] bg-white border border-white/60 shadow-[0_8px_20px_rgba(0,0,0,0.18)] overflow-hidden ${
        isFloating ? 'rounded-[14px]' : 'rounded-t-[14px] translate-y-2'
      }`}
      style={scale !== 1 ? { transform: `scale(${scale})` } : undefined}
      aria-hidden
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5">
        <span className="text-[5px] font-bold text-gray-700">9:41</span>
        <div className="flex items-center gap-[1px]">
          <div className="w-[4px] h-[3px] rounded-[1px] bg-gray-600" />
          <div className="w-[3px] h-[3px] rounded-full bg-gray-600" />
          <div className="w-[6px] h-[3px] rounded-[1px] bg-gray-600" />
        </div>
      </div>

      {/* Body */}
      <div className="relative h-[calc(100%-12px)] px-1.5">
        {renderTemplateBody(template.id, brand)}
      </div>
    </div>
  );
}

function renderTemplateBody(id: TemplateId, brand: string) {
  switch (id) {
    case 'A-1':
      return <PreviewA1 brand={brand} />;
    case 'A-2':
      return <PreviewA2 brand={brand} />;
    case 'B-1':
      return <PreviewB1 brand={brand} />;
    case 'B-2':
      return <PreviewB2 brand={brand} />;
    case 'B-3':
      return <PreviewB3 brand={brand} />;
    case 'C-1':
      return <PreviewC1 brand={brand} />;
    case 'C-2':
      return <PreviewC2 brand={brand} />;
    case 'C-4':
      return <PreviewC4 brand={brand} />;
    case 'D-1':
      return <PreviewD1 brand={brand} />;
    case 'D-2':
      return <PreviewD2 brand={brand} />;
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Shared mini building blocks
// ─────────────────────────────────────────────────────────────

function TopBar({ brand }: { brand: string }) {
  return (
    <div className="flex items-center justify-between mt-0.5 mb-1">
      <div
        className="h-2.5 w-10 rounded-[2px]"
        style={{ backgroundColor: brand }}
      />
      <div className="flex gap-[2px]">
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}

function GNBTabBar({ brand }: { brand: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-5 bg-white border-t border-gray-200 flex items-center justify-around px-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col items-center gap-[1px]">
          <div
            className="w-1.5 h-1.5 rounded-[1px]"
            style={{ backgroundColor: i === 0 ? brand : '#D1D5DB' }}
          />
          <div
            className="h-[2px] w-2 rounded-[1px]"
            style={{ backgroundColor: i === 0 ? brand : '#E5E7EB' }}
          />
        </div>
      ))}
    </div>
  );
}

function FAB({ brand }: { brand: string }) {
  return (
    <div
      className="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
      style={{ backgroundColor: brand }}
    >
      <div className="relative w-2.5 h-2.5">
        <div className="absolute top-1/2 left-0 w-full h-[1.5px] -translate-y-1/2 bg-white rounded-full" />
        <div className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-white rounded-full" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// A계열 — GNB 탭바형
// ─────────────────────────────────────────────────────────────

function PreviewA1({ brand }: { brand: string }) {
  // 스탬프 카드형: 홈 상단 스탬프 카드
  return (
    <>
      <TopBar brand={brand} />
      <div
        className="rounded-md p-1.5 mb-1.5 border"
        style={{ backgroundColor: `${brand}15`, borderColor: `${brand}40` }}
      >
        <div className="flex items-center justify-between mb-1">
          <div
            className="h-1 w-6 rounded-full"
            style={{ backgroundColor: brand }}
          />
          <div className="h-1 w-3 rounded-full bg-gray-300" />
        </div>
        <div className="grid grid-cols-5 gap-[2px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-full"
              style={{
                backgroundColor: i < 6 ? brand : `${brand}25`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-1">
        <div className="flex-1 h-6 rounded bg-gray-100" />
        <div className="flex-1 h-6 rounded bg-gray-100" />
      </div>
      <GNBTabBar brand={brand} />
    </>
  );
}

function PreviewA2({ brand }: { brand: string }) {
  // 캐러셀 쿠폰형
  return (
    <>
      <TopBar brand={brand} />
      <div
        className="h-12 rounded-md mb-1 relative"
        style={{
          background: `linear-gradient(135deg, ${brand}, ${brand}80)`,
        }}
      >
        <div className="absolute bottom-0.5 left-0 right-0 flex items-center justify-center gap-[2px]">
          <div className="w-1 h-1 rounded-full bg-white" />
          <div className="w-1 h-1 rounded-full bg-white/50" />
          <div className="w-1 h-1 rounded-full bg-white/50" />
        </div>
        <div className="absolute top-1.5 left-1.5 h-1 w-5 rounded-full bg-white/80" />
        <div className="absolute top-3 left-1.5 h-[3px] w-7 rounded-full bg-white/60" />
      </div>
      <div className="grid grid-cols-4 gap-1 mb-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-[2px]">
            <div
              className="w-5 h-5 rounded-md"
              style={{ backgroundColor: `${brand}25` }}
            />
            <div className="h-[2px] w-4 rounded-full bg-gray-300" />
          </div>
        ))}
      </div>
      <GNBTabBar brand={brand} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// B계열 — FAB형
// ─────────────────────────────────────────────────────────────

function PreviewB1({ brand }: { brand: string }) {
  // 기본 타일형
  return (
    <>
      <TopBar brand={brand} />
      <div className="grid grid-cols-2 gap-1 mt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-md flex flex-col items-center justify-center gap-0.5"
            style={{ backgroundColor: `${brand}15` }}
          >
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: `${brand}80` }}
            />
            <div className="h-[2px] w-5 rounded-full bg-gray-300" />
          </div>
        ))}
      </div>
      <FAB brand={brand} />
    </>
  );
}

function PreviewB2({ brand }: { brand: string }) {
  // 스탬프 카드 FAB
  return (
    <>
      <TopBar brand={brand} />
      <div
        className="rounded-md p-1 mb-1 border flex items-center gap-1"
        style={{ backgroundColor: `${brand}15`, borderColor: `${brand}40` }}
      >
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: brand }}
        />
        <div className="flex-1 flex gap-[1px]">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 aspect-square rounded-full"
              style={{
                backgroundColor: i < 5 ? brand : `${brand}30`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md"
            style={{ backgroundColor: `${brand}12` }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1 mt-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-md"
            style={{ backgroundColor: `${brand}12` }}
          />
        ))}
      </div>
      <FAB brand={brand} />
    </>
  );
}

function PreviewB3({ brand }: { brand: string }) {
  // 멤버십 바코드형
  return (
    <>
      <TopBar brand={brand} />
      <div
        className="rounded-md p-1.5 mb-1 border"
        style={{ backgroundColor: '#fff', borderColor: `${brand}40` }}
      >
        <div className="flex items-center justify-between mb-1">
          <div
            className="h-1 w-6 rounded-full"
            style={{ backgroundColor: brand }}
          />
          <div
            className="h-[6px] w-6 rounded-[1px]"
            style={{ backgroundColor: `${brand}20` }}
          />
        </div>
        {/* Barcode stripes */}
        <div className="flex gap-[1px] h-4 items-center">
          {[2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2, 1].map((w, i) => (
            <div
              key={i}
              className="h-full bg-gray-800"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>
        <div className="h-[2px] w-full mt-1 rounded-full bg-gray-200" />
      </div>
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded"
            style={{ backgroundColor: `${brand}12` }}
          />
        ))}
      </div>
      <FAB brand={brand} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// C계열 — 타일메뉴형
// ─────────────────────────────────────────────────────────────

function PreviewC1({ brand }: { brand: string }) {
  // 배너 + 타일
  return (
    <>
      <TopBar brand={brand} />
      <div
        className="h-10 rounded-md mb-1 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brand}, ${brand}80)`,
        }}
      >
        <div className="absolute top-1.5 left-1.5 h-1 w-8 rounded-full bg-white/80" />
        <div className="absolute top-3 left-1.5 h-[3px] w-6 rounded-full bg-white/60" />
      </div>
      <div className="grid grid-cols-2 gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/3] rounded-md flex items-center justify-center"
            style={{ backgroundColor: `${brand}15` }}
          >
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: `${brand}80` }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function PreviewC2({ brand }: { brand: string }) {
  // 리스트 타일
  return (
    <>
      <TopBar brand={brand} />
      <div className="flex flex-col gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 rounded-md px-1 py-1"
            style={{ backgroundColor: i % 2 === 0 ? `${brand}10` : '#fff' }}
          >
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: `${brand}70` }}
            />
            <div className="flex-1 flex flex-col gap-[1px]">
              <div className="h-[2px] w-full rounded-full bg-gray-300" />
              <div className="h-[2px] w-2/3 rounded-full bg-gray-200" />
            </div>
            <div className="w-[4px] h-[4px] rounded-full bg-gray-300" />
          </div>
        ))}
      </div>
    </>
  );
}

function PreviewC4({ brand }: { brand: string }) {
  // 2행 격자 타일
  return (
    <>
      <TopBar brand={brand} />
      <div
        className="h-6 rounded-md mb-1 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brand}, ${brand}70)`,
        }}
      >
        <div className="absolute top-1 left-1 h-[2px] w-8 rounded-full bg-white/80" />
      </div>
      {Array.from({ length: 2 }).map((_, row) => (
        <div key={row} className="grid grid-cols-4 gap-1 mb-1">
          {Array.from({ length: 4 }).map((_, col) => (
            <div
              key={col}
              className="aspect-square rounded flex items-center justify-center"
              style={{ backgroundColor: `${brand}18` }}
            >
              <div
                className="w-2 h-2 rounded"
                style={{ backgroundColor: `${brand}90` }}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// D계열 — 배달카드형
// ─────────────────────────────────────────────────────────────

function PreviewD1({ brand }: { brand: string }) {
  // 전면 카드 — 배달/포장을 첫 화면에서 바로 선택
  return (
    <>
      <TopBar brand={brand} />
      <div className="flex flex-col gap-1 mt-0.5">
        <div
          className="h-[52px] rounded-md relative overflow-hidden flex items-center px-2"
          style={{
            background: `linear-gradient(135deg, ${brand}, ${brand}80)`,
          }}
        >
          <div className="flex flex-col gap-[3px]">
            <div className="h-[3px] w-6 rounded-full bg-white" />
            <div className="h-[2px] w-8 rounded-full bg-white/70" />
          </div>
          <div className="ml-auto w-7 h-7 rounded-full bg-white/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white/70" />
          </div>
        </div>
        <div
          className="h-[52px] rounded-md relative overflow-hidden flex items-center px-2 border"
          style={{
            borderColor: `${brand}40`,
            backgroundColor: `${brand}10`,
          }}
        >
          <div className="flex flex-col gap-[3px]">
            <div
              className="h-[3px] w-6 rounded-full"
              style={{ backgroundColor: brand }}
            />
            <div
              className="h-[2px] w-8 rounded-full"
              style={{ backgroundColor: `${brand}60` }}
            />
          </div>
          <div
            className="ml-auto w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${brand}30` }}
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: brand }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function PreviewD2({ brand }: { brand: string }) {
  // 오버레이 팝업 — 평소엔 브랜드 화면, 주문 시 팝업
  return (
    <>
      <TopBar brand={brand} />
      <div
        className="h-14 rounded-md mb-1 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${brand}, ${brand}70)`,
        }}
      >
        <div className="absolute top-1 left-1 h-1 w-8 rounded-full bg-white/80" />
        <div className="absolute top-2.5 left-1 h-[3px] w-10 rounded-full bg-white/60" />
        <div className="absolute bottom-1 left-1 right-1 h-4 rounded bg-white/90 flex items-center justify-center">
          <div
            className="h-[3px] w-8 rounded-full"
            style={{ backgroundColor: brand }}
          />
        </div>
      </div>
      {/* Overlay popup hint */}
      <div className="absolute inset-x-2 bottom-2 top-14">
        <div className="absolute inset-0 bg-black/25 rounded-b-md" />
        <div className="absolute left-1 right-1 bottom-1 rounded-md bg-white shadow-lg p-1.5 border border-gray-200">
          <div className="flex gap-1 mb-1">
            <div
              className="flex-1 h-5 rounded"
              style={{ backgroundColor: `${brand}20` }}
            />
            <div
              className="flex-1 h-5 rounded"
              style={{ backgroundColor: brand }}
            />
          </div>
          <div className="h-[2px] w-1/2 mx-auto rounded-full bg-gray-200" />
        </div>
      </div>
    </>
  );
}

export default TemplatePreview;
