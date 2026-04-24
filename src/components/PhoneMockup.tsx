import { useState } from 'react';
import {
  List,
  Barcode,
  Bell,
  House,
  CalendarBlank,
  Gift,
  SquaresFour,
  ShoppingBag,
  MapPin,
  CreditCard,
  Megaphone,
  Storefront,
  User,
  CaretRight,
  ClipboardText,
  Cookie,
  CoffeeBean,
  HandbagSimple,
  Stamp,
  ArrowDown,
  Check,
  Star,
  ArrowClockwise,
  Camera,
  X,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PhoneMockupProps {
  templateId: string;
  brandColor: string;
  brandName: string;
  bannerRatio: string;
  activeScreen: string;
  /** true = show logo image, false = show text brandName */
  showHeaderBI?: boolean;
  /** Data URL of uploaded logo image */
  headerLogoUrl?: string | null;
  /** Data URL of uploaded FAB icon */
  fabIconUrl?: string | null;
  /** Ordered list of quick menu feature labels */
  quickMenuOrder?: string[];
  /** Callback when user taps a navigable element inside the mockup */
  onScreenChange?: (screen: string) => void;
  /** Force a specific order sub-view for capture (store/menu/detail/cart/payment) */
  orderView?: string;
}

/** Map feature labels to screen names */
const FEATURE_SCREEN_MAP: Record<string, string> = {
  '주문': 'order',
  '주문내역': 'order',
  '스탬프': 'stamp',
  '쿠폰': 'coupon',
  '공지': 'news',
  '이벤트': 'news',
  '새소식': 'news',
};

/** Map feature labels to Phosphor icons */
const FEATURE_ICON_MAP: Record<string, PhosphorIcon> = {
  '주문': ShoppingBag,
  '주문내역': ClipboardText,
  '스탬프': Stamp,
  '쿠폰': CreditCard,
  '공지': Megaphone,
  '선불카드': CreditCard,
  '매장찾기': Storefront,
  '이벤트': CalendarBlank,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getBannerHeight(ratio: string): number {
  switch (ratio) {
    case '2:1':
      return 180;
    case '3:2':
      return 216;
    case '1:1':
      return 328;
    case '3:4':
      return 280;
    default:
      return 180;
  }
}

/** Produce a hex color with alpha (0-1). Returns an 8-char hex string. */
function hexAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/* ---- Status Bar ---- */
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-medium text-text-primary h-12 shrink-0">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <div className="w-4 h-2 rounded-sm bg-text-primary" />
      </div>
    </div>
  );
}

/* ---- Header ---- */
function Header({
  variant,
  brandColor,
  brandName,
  hideBarcode = false,
  showPersonIcon = false,
  showHeaderBI = true,
  headerLogoUrl,
}: {
  variant: 'hamburger' | 'clean';
  brandColor: string;
  brandName: string;
  hideBarcode?: boolean;
  showPersonIcon?: boolean;
  showHeaderBI?: boolean;
  headerLogoUrl?: string | null;
}) {
  return (
    <div
      className="flex items-center justify-between px-4 h-[54px] shrink-0"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Left */}
      <div className="w-10 flex items-center">
        {variant === 'hamburger' && (
          <List size={22} className="text-text-primary" />
        )}
      </div>

      {/* Center – brand */}
      <div className="flex items-center gap-1.5">
        {showHeaderBI ? (
          headerLogoUrl ? (
            <img src={headerLogoUrl} alt="로고" className="h-7 object-contain" />
          ) : (
            <div
              className="w-24 h-7 rounded shrink-0"
              style={{ backgroundColor: hexAlpha(brandColor, 0.15) }}
            />
          )
        ) : brandName ? (
          <span className="font-bold text-sm tracking-tight text-text-primary">
            {brandName}
          </span>
        ) : (
          <div className="w-16 h-3 rounded bg-border" />
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {showPersonIcon && <User size={20} className="text-text-secondary" />}
        {!hideBarcode && !showPersonIcon && (
          <Barcode size={20} className="text-text-secondary" />
        )}
        <Bell size={20} className="text-text-secondary" />
      </div>
    </div>
  );
}

/* ---- Banner ---- */
function Banner({
  brandColor,
  bannerRatio,
  fullWidth = false,
}: {
  brandColor: string;
  bannerRatio: string;
  fullWidth?: boolean;
}) {
  const h = getBannerHeight(bannerRatio);
  return (
    <div
      className={`relative ${fullWidth ? '' : 'mx-4'} rounded-xl overflow-hidden`}
      style={{
        height: h,
        background: `linear-gradient(135deg, ${hexAlpha(brandColor, 0.15)}, ${hexAlpha(brandColor, 0.25)})`,
      }}
    >
      {/* Label badge bottom-right */}
      <span
        className="absolute bottom-2 right-2 text-[9px] px-2 py-0.5 rounded font-medium text-white"
        style={{ backgroundColor: hexAlpha(brandColor, 0.6) }}
      >
        레이블
      </span>
    </div>
  );
}

/* ---- Product Item (vertical list row) ---- */
function ProductItemRow() {
  return (
    <div className="flex items-center gap-3 py-2">
      {/* Circle image placeholder */}
      <div className="w-[50px] h-[50px] rounded-full shrink-0 bg-gradient-to-br from-amber-100 to-orange-200" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-text-primary">시나몬 애플티</p>
        <p className="text-[12px] font-bold text-text-primary mt-0.5">5,600원</p>
        <div className="flex gap-1 mt-1">
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-500 font-medium">
            레이블
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-500 font-medium">
            레이블
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---- Product Item (horizontal card) ---- */
function ProductItemCard() {
  return (
    <div className="shrink-0 w-[120px]">
      <div className="w-[50px] h-[50px] rounded-full mx-auto bg-gradient-to-br from-amber-100 to-orange-200" />
      <p className="text-[12px] font-semibold text-text-primary mt-2 text-center truncate">
        시나몬 애플티
      </p>
      <p className="text-[11px] font-bold text-text-primary text-center">5,600원</p>
      <div className="flex gap-1 mt-1 justify-center">
        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-500 font-medium">
          레이블
        </span>
        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-500 font-medium">
          레이블
        </span>
      </div>
    </div>
  );
}

/* ---- Menu Section ---- */
function MenuSection({
  variant,
  showMore = false,
}: {
  variant: 'horizontal' | 'vertical';
  showMore?: boolean;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="text-[14px] font-bold text-text-primary">
          이런 메뉴는 어떠세요?
        </h3>
        {showMore && (
          <span className="text-[11px] text-text-muted flex items-center gap-0.5">
            더보기 <CaretRight size={10} />
          </span>
        )}
      </div>
      {variant === 'horizontal' ? (
        <div className="flex gap-3 px-4 overflow-x-auto phone-scroll pb-2">
          <ProductItemCard />
          <ProductItemCard />
          <ProductItemCard />
        </div>
      ) : (
        <div className="flex flex-col gap-1 px-4">
          <ProductItemRow />
          <ProductItemRow />
          <ProductItemRow />
        </div>
      )}
    </div>
  );
}

/* ---- Quick Menu Tile (filled) ---- */
function QuickMenuTileFilled({
  icon: Icon,
  label,
  brandColor,
  onClick,
}: {
  icon: PhosphorIcon;
  label: string;
  brandColor: string;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: hexAlpha(brandColor, 0.12) }}
      >
        <Icon size={22} weight="fill" style={{ color: brandColor }} />
      </div>
      <span className="text-[10px] text-text-secondary">{label}</span>
    </button>
  );
}

/* ---- Quick Menu Tile (stroke/outline) ---- */
function QuickMenuTileOutline({
  icon: Icon,
  label,
  brandColor,
  onClick,
}: {
  icon: PhosphorIcon;
  label: string;
  brandColor: string;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1.5">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center border-2"
        style={{ borderColor: hexAlpha(brandColor, 0.3) }}
      >
        <Icon size={20} style={{ color: brandColor }} />
      </div>
      <span className="text-[10px] text-text-secondary">{label}</span>
    </button>
  );
}

/* ---- FAB Button ---- */
function FABButton({ fabIconUrl, onClick }: { fabIconUrl?: string | null; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-dark flex flex-col items-center justify-center shadow-lg z-10">
      {fabIconUrl ? (
        <img src={fabIconUrl} alt="ORDER" className="w-6 h-6 object-contain" />
      ) : (
        <ClipboardText size={20} weight="fill" className="text-white" />
      )}
      <span className="text-[8px] font-bold text-white mt-0.5 tracking-wide">
        ORDER
      </span>
    </button>
  );
}

/* ---- Bottom Tab Bar (GNB) ---- */
const GNB_ICON_MAP: Record<string, PhosphorIcon> = {
  '홈': House,
  '주문': ShoppingBag,
  '이벤트': CalendarBlank,
  '선물하기': Gift,
  '전체메뉴': SquaresFour,
  '주문내역': ClipboardText,
  '스탬프': Stamp,
  '쿠폰': CreditCard,
  '공지': Megaphone,
  '선불카드': CreditCard,
  '매장찾기': Storefront,
};

function BottomTabBar({
  brandColor,
  quickMenuOrder = [],
  orderIconUrl,
  onScreenChange,
}: {
  brandColor: string;
  quickMenuOrder?: string[];
  orderIconUrl?: string | null;
  onScreenChange?: (screen: string) => void;
}) {
  const defaultFeatures = ['이벤트', '선물하기', '전체메뉴'];
  const features = quickMenuOrder.length > 0
    ? quickMenuOrder.filter((f) => f !== '홈' && f !== '주문')
    : defaultFeatures;

  // GNB 5탭: 홈 + 앞기능 + 주문(가운데, 튀어나옴) + 뒷기능들
  const leftTabs = [
    { label: '홈', active: false },
    ...(features[0] ? [{ label: features[0], active: false }] : []),
  ];
  const rightTabs = features.slice(1).map((f) => ({ label: f, active: false }));

  return (
    <div className="relative h-20 border-t border-border flex items-center justify-around px-2 shrink-0 bg-white">
      {/* Left tabs */}
      {leftTabs.map((t) => {
        const Icon = GNB_ICON_MAP[t.label] || SquaresFour;
        const screen = FEATURE_SCREEN_MAP[t.label];
        return (
          <button key={t.label} type="button" onClick={() => screen && onScreenChange?.(screen)} className="flex flex-col items-center gap-1 flex-1 pt-2">
            <Icon size={22} style={{ color: '#8A8A8A' }} />
            <span className="text-[10px] font-medium" style={{ color: '#8A8A8A' }}>{t.label}</span>
          </button>
        );
      })}

      {/* Center – 주문 (protruding circle) */}
      <button type="button" onClick={() => onScreenChange?.('order')} className="flex flex-col items-center flex-1 relative">
        <div
          className="absolute -top-[17px] w-14 h-14 rounded-full flex items-center justify-center shadow-md overflow-hidden"
          style={{ backgroundColor: brandColor }}
        >
          {orderIconUrl ? (
            <img src={orderIconUrl} alt="주문" className="w-8 h-8 object-contain" />
          ) : (
            <ShoppingBag size={26} weight="fill" className="text-white" />
          )}
        </div>
        <span className="text-[10px] font-medium mt-[42px]" style={{ color: '#8A8A8A' }}>주문</span>
      </button>

      {/* Right tabs */}
      {rightTabs.map((t) => {
        const Icon = GNB_ICON_MAP[t.label] || SquaresFour;
        const screen = FEATURE_SCREEN_MAP[t.label];
        return (
          <button key={t.label} type="button" onClick={() => screen && onScreenChange?.(screen)} className="flex flex-col items-center gap-1 flex-1 pt-2">
            <Icon size={22} style={{ color: '#8A8A8A' }} />
            <span className="text-[10px] font-medium" style={{ color: '#8A8A8A' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---- Address Bar ---- */
function AddressBar({ brandColor }: { brandColor: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-white">
      <MapPin size={16} weight="fill" style={{ color: brandColor }} />
      <span className="text-[11px] text-text-primary flex-1 truncate">
        주소 경기 성남시 분당구 이매동 104
      </span>
      <button
        type="button"
        className="text-[10px] px-2 py-1 rounded border border-border text-text-secondary"
      >
        변경
      </button>
    </div>
  );
}

/* ---- Stamp Card ---- */
function StampCard({ brandColor }: { brandColor: string }) {
  return (
    <div
      className="mx-4 rounded-xl p-4"
      style={{ backgroundColor: hexAlpha(brandColor, 0.1) }}
    >
      <div className="text-[10px] font-semibold text-text-muted tracking-wider mb-1">
        STAMP CARD
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold text-text-primary">
          코코넛님
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-[22px] font-extrabold" style={{ color: brandColor }}>
            8
          </span>
          <span className="text-[11px] text-text-secondary">개</span>
        </div>
      </div>
    </div>
  );
}


/* ---- Delivery Card ---- */
function DeliveryCard({
  icon: Icon,
  title,
  subtitle,
  brandColor,
}: {
  icon: PhosphorIcon;
  title: string;
  subtitle: string;
  brandColor: string;
}) {
  return (
    <div className="flex-1 rounded-xl bg-white border border-border shadow-sm p-4 flex flex-col items-center justify-center gap-2 min-h-[153px]">
      <Icon size={32} style={{ color: brandColor }} />
      <div className="text-center">
        <p className="text-[11px] font-bold text-text-primary">{title}</p>
        <p className="text-[10px] text-text-muted">{subtitle}</p>
      </div>
    </div>
  );
}

/* ---- Greeting ---- */
function Greeting({
  prefix,
  name,
  brandColor,
  hasBg = false,
}: {
  prefix: string;
  name: string;
  brandColor?: string;
  hasBg?: boolean;
}) {
  if (hasBg && brandColor) {
    return (
      <div className="px-4 py-5" style={{ backgroundColor: brandColor }}>
        <p className="text-[13px] text-white/80">{prefix}</p>
        <p className="text-[20px] font-extrabold text-white">{name}</p>
      </div>
    );
  }
  return (
    <div className="px-4 pt-4 pb-2">
      <p className="text-[13px] text-text-secondary">{prefix}</p>
      <p className="text-[20px] font-extrabold text-text-primary">{name}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Template renderers
// ---------------------------------------------------------------------------

/* A-1: GNB 탭바형 - 스탬프 카드 */
function TemplateA1({ brandColor, brandName, bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl, quickMenuOrder, onScreenChange }: TemplateProps) {
  return (
    <>
      <StatusBar />
      <Header variant="clean" brandColor={brandColor} brandName={brandName} showHeaderBI={showHeaderBI} headerLogoUrl={headerLogoUrl} />
      <div className="flex-1 overflow-y-auto phone-scroll">
        <div className="mt-3">
          <Banner brandColor={brandColor} bannerRatio={bannerRatio} />
        </div>
        {/* Brand color card */}
        <div
          className="mx-4 mt-3 rounded-xl p-4 flex items-center justify-between"
          style={{ backgroundColor: brandColor }}
        >
          <div>
            <p className="text-[13px] text-white font-semibold">코코넛님 안녕하세요!</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <Stamp size={16} weight="fill" className="text-white/80" />
              <span className="text-[11px] text-white font-medium">스탬프 9개</span>
            </div>
            <div className="flex items-center gap-1">
              <Cookie size={16} weight="fill" className="text-white/80" />
              <span className="text-[11px] text-white font-medium">쿠폰 99개</span>
            </div>
          </div>
        </div>
        <MenuSection variant="vertical" />
        <div className="h-4" />
      </div>
      <BottomTabBar brandColor={brandColor} quickMenuOrder={quickMenuOrder} orderIconUrl={fabIconUrl} onScreenChange={onScreenChange} />
    </>
  );
}

/* A-2: GNB 탭바형 - 캐러셀 쿠폰 */
function TemplateA2({ brandColor, brandName, bannerRatio: _bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl, quickMenuOrder, onScreenChange }: TemplateProps) {
  return (
    <>
      <StatusBar />
      <Header
        variant="clean"
        brandColor={brandColor}
        brandName={brandName}
        showPersonIcon
        showHeaderBI={showHeaderBI}
        headerLogoUrl={headerLogoUrl}
      />
      <div className="flex-1 overflow-y-auto phone-scroll">
        {/* Membership card carousel */}
        <div className="flex items-center justify-center gap-2 px-4 mt-3 overflow-hidden">
          {/* Peek left */}
          <div
            className="w-10 h-[220px] rounded-xl shrink-0 opacity-40"
            style={{ backgroundColor: hexAlpha(brandColor, 0.2) }}
          />
          {/* Main card */}
          <div
            className="w-[260px] h-[260px] rounded-2xl shrink-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${hexAlpha(brandColor, 0.2)}, ${hexAlpha(brandColor, 0.35)})`,
            }}
          >
            <span className="text-[13px] text-text-muted">멤버십 카드</span>
          </div>
          {/* Peek right */}
          <div
            className="w-10 h-[220px] rounded-xl shrink-0 opacity-40"
            style={{ backgroundColor: hexAlpha(brandColor, 0.2) }}
          />
        </div>

        {/* Coupon shortcut */}
        <div className="px-4 mt-4">
          <h3 className="text-[13px] font-bold text-text-primary mb-2">
            쿠폰 바로가기
          </h3>
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-white">
            <div>
              <p className="text-[12px] font-semibold text-text-primary">
                멤버십 쿠폰 5,000원
              </p>
            </div>
            <ArrowDown size={18} className="text-text-muted" />
          </div>
        </div>

        <MenuSection variant="horizontal" />
        <div className="h-4" />
      </div>
      <BottomTabBar brandColor={brandColor} quickMenuOrder={quickMenuOrder} orderIconUrl={fabIconUrl} onScreenChange={onScreenChange} />
    </>
  );
}

/* B-1: FAB형 - 기본 타일 */
function TemplateB1({ brandColor, brandName, bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl, quickMenuOrder, onScreenChange }: TemplateProps) {
  return (
    <>
      <StatusBar />
      <Header variant="hamburger" brandColor={brandColor} brandName={brandName} showHeaderBI={showHeaderBI} headerLogoUrl={headerLogoUrl} />
      <div className="flex-1 overflow-y-auto phone-scroll relative">
        {/* Greeting */}
        <div className="px-4 pt-3 pb-2">
          <p className="text-[13px] text-text-secondary">코코넛님,</p>
          <p className="text-[20px] font-extrabold text-text-primary">안녕하세요!</p>
        </div>
        {/* Banner full width */}
        <div className="mt-2">
          <Banner brandColor={brandColor} bannerRatio={bannerRatio} />
        </div>
        {/* Quick menu: 4 filled tiles */}
        <div className="grid grid-cols-4 gap-3 px-4 mt-4">
          {(quickMenuOrder.length > 0 ? quickMenuOrder : ['스탬프', '쿠폰', '매장찾기', '이벤트']).map((feat) => {
            const Icon = FEATURE_ICON_MAP[feat] || CreditCard;
            return <QuickMenuTileFilled key={feat} icon={Icon} label={feat} brandColor={brandColor} onClick={() => onScreenChange?.(FEATURE_SCREEN_MAP[feat] || 'home')} />;
          })}
        </div>
        <MenuSection variant="horizontal" />
        <div className="h-24" />
      </div>
      <FABButton fabIconUrl={fabIconUrl} onClick={() => onScreenChange?.('order')} />
    </>
  );
}

/* B-2: FAB형 - 스탬프 카드 */
function TemplateB2({ brandColor, brandName, bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl, quickMenuOrder, onScreenChange }: TemplateProps) {
  return (
    <>
      <StatusBar />
      <Header variant="hamburger" brandColor={brandColor} brandName={brandName} showHeaderBI={showHeaderBI} headerLogoUrl={headerLogoUrl} />
      <div className="flex-1 overflow-y-auto phone-scroll relative">
        <div className="mt-3">
          <StampCard brandColor={brandColor} />
        </div>
        <div className="mt-3">
          <Banner brandColor={brandColor} bannerRatio={bannerRatio} />
        </div>
        {/* Quick menu: 4 stroke-style outline tiles */}
        <div className="grid grid-cols-4 gap-3 px-4 mt-4">
          {(quickMenuOrder.length > 0 ? quickMenuOrder : ['주문내역', '스탬프', '공지', '선불카드']).map((feat) => {
            const Icon = FEATURE_ICON_MAP[feat] || CreditCard;
            return <QuickMenuTileOutline key={feat} icon={Icon} label={feat} brandColor={brandColor} onClick={() => onScreenChange?.(FEATURE_SCREEN_MAP[feat] || 'home')} />;
          })}
        </div>
        <MenuSection variant="vertical" />
        <div className="h-24" />
      </div>
      <FABButton fabIconUrl={fabIconUrl} onClick={() => onScreenChange?.('order')} />
    </>
  );
}

/* B-3: FAB형 - 멤버십 바코드 */
function TemplateB3({ brandColor, brandName, bannerRatio: _bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl, quickMenuOrder, onScreenChange }: TemplateProps) {
  return (
    <>
      <StatusBar />
      <Header
        variant="hamburger"
        brandColor={brandColor}
        brandName={brandName}
        hideBarcode
        showHeaderBI={showHeaderBI}
        headerLogoUrl={headerLogoUrl}
      />
      <div className="flex-1 overflow-y-auto phone-scroll relative">
        {/* Greeting + Barcode on brand bg */}
        <div className="px-4 pt-4 pb-4" style={{ backgroundColor: brandColor }}>
          <p className="text-[13px] text-white/80">환영합니다</p>
          <p className="text-[20px] font-extrabold text-white mt-1">코코넛님!</p>
          {/* Barcode card (white card on brand bg) */}
          <div className="mt-4 rounded-xl bg-white p-4">
            <div className="flex items-end justify-center gap-[2px] h-14 mb-2">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="bg-text-primary" style={{ width: i % 3 === 0 ? 3 : 1.5, height: `${50 + (i % 5) * 8}%` }} />
              ))}
            </div>
            <p className="text-[13px] text-text-primary text-center tracking-[0.15em]">8049 8829 2008 4604</p>
          </div>
        </div>
        {/* Quick menu: 4 filled tiles */}
        <div className="grid grid-cols-4 gap-3 px-4 mt-4">
          {(quickMenuOrder.length > 0 ? quickMenuOrder : ['스탬프', '쿠폰', '매장찾기', '이벤트']).map((feat) => {
            const Icon = FEATURE_ICON_MAP[feat] || CreditCard;
            return <QuickMenuTileFilled key={feat} icon={Icon} label={feat} brandColor={brandColor} onClick={() => onScreenChange?.(FEATURE_SCREEN_MAP[feat] || 'home')} />;
          })}
        </div>
        <MenuSection variant="vertical" />
        <div className="h-24" />
      </div>
      <FABButton fabIconUrl={fabIconUrl} onClick={() => onScreenChange?.('order')} />
    </>
  );
}

/* C-1: 타일메뉴형 - 배너+타일 슬라이드업 */
function TemplateC1({ brandColor, brandName, bannerRatio: _bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl: _fabIconUrl, quickMenuOrder, onScreenChange }: TemplateProps) {
  return (
    <>
      <StatusBar />
      <Header variant="clean" brandColor={brandColor} brandName={brandName} showHeaderBI={showHeaderBI} headerLogoUrl={headerLogoUrl} />
      <div className="flex-1 relative overflow-hidden">
        {/* Full-screen banner background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${hexAlpha(brandColor, 0.18)}, ${hexAlpha(brandColor, 0.3)})`,
          }}
        />
        {/* Slide-up panel from bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col" style={{ height: '58%' }}>
          {/* White content area with rounded top */}
          <div className="bg-white rounded-t-3xl pt-5 flex-1 flex flex-col overflow-hidden">
            {/* 3 icon tiles row */}
            <div className="flex items-center justify-around px-4 pb-4 shrink-0">
              {(quickMenuOrder.length > 0 ? quickMenuOrder : ['주문', '주문내역', '매장찾기']).map((feat, idx, arr) => {
                const Icon = FEATURE_ICON_MAP[feat] || CreditCard;
                return (
                  <div key={feat} className="flex items-center">
                    <button type="button" onClick={() => onScreenChange?.(FEATURE_SCREEN_MAP[feat] || 'home')} className="flex flex-col items-center gap-1.5 px-6">
                      <Icon size={24} style={{ color: brandColor }} />
                      <span className="text-[11px] text-text-secondary">{feat}</span>
                    </button>
                    {idx < arr.length - 1 && <div className="w-px h-10 bg-border" />}
                  </div>
                );
              })}
            </div>
            <div className="flex-1 overflow-y-auto phone-scroll">
              <MenuSection variant="horizontal" />
            </div>
          </div>
          {/* Bottom info bar — 여백 없이 좌우+하단 끝까지, 상단 radius 적용 */}
          <div
            className="px-4 py-3 flex items-center justify-between shrink-0 rounded-t-2xl"
            style={{ backgroundColor: brandColor }}
          >
            <div>
              <span className="text-[11px] text-white/80">닉네임최대7자님</span>
              <br />
              <span className="text-[12px] text-white font-medium">안녕하세요</span>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1.5 rounded-lg">
                <Stamp size={14} className="text-white" />
                <span className="text-[11px] text-white font-semibold">스탬프</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1.5 rounded-lg">
                <CreditCard size={14} className="text-white" />
                <span className="text-[11px] text-white font-semibold">쿠폰</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* C-2: 타일메뉴형 - 리스트 타일 */
function TemplateC2({ brandColor, brandName, bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl: _fabIconUrl, quickMenuOrder, onScreenChange }: TemplateProps) {
  return (
    <>
      <StatusBar />
      <Header variant="hamburger" brandColor={brandColor} brandName={brandName} showHeaderBI={showHeaderBI} headerLogoUrl={headerLogoUrl} />
      <div className="flex-1 overflow-y-auto phone-scroll">
        <Greeting prefix="환영합니다" name="코코넛님!" />
        {/* Horizontal pill-shaped list tiles */}
        <div className="flex gap-2 px-4 mt-1 overflow-x-auto phone-scroll pb-2">
          {(quickMenuOrder.length > 0 ? quickMenuOrder : ['주문', '쿠폰', '스탬프', '선불카드']).map((feat, idx) => {
            const Icon = FEATURE_ICON_MAP[feat] || CreditCard;
            const active = idx === 0;
            return (
              <button
                type="button"
                onClick={() => onScreenChange?.(FEATURE_SCREEN_MAP[feat] || 'home')}
                key={feat}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full border"
                style={{
                  backgroundColor: active ? brandColor : 'white',
                  borderColor: active ? brandColor : '#E4E4E0',
                }}
              >
                <Icon
                  size={16}
                  weight={active ? 'fill' : 'regular'}
                  style={{ color: active ? 'white' : '#5A5A5A' }}
                />
                <span
                  className="text-[11px] font-medium"
                  style={{ color: active ? 'white' : '#5A5A5A' }}
                >
                  {feat}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3">
          <Banner brandColor={brandColor} bannerRatio={bannerRatio} />
        </div>
        <MenuSection variant="vertical" />
        <div className="h-4" />
      </div>
    </>
  );
}

/* C-4: 타일메뉴형 - 2행 격자 */
function TemplateC4({ brandColor, brandName, bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl: _fabIconUrl, quickMenuOrder, onScreenChange: _onScreenChange }: TemplateProps) {
  return (
    <>
      <StatusBar />
      <Header variant="hamburger" brandColor={brandColor} brandName={brandName} showHeaderBI={showHeaderBI} headerLogoUrl={headerLogoUrl} />
      <div className="flex-1 overflow-y-auto phone-scroll">
        <Greeting prefix="환영합니다" name="코코넛님!" />
        <div className="mt-2">
          <Banner brandColor={brandColor} bannerRatio={bannerRatio} />
        </div>
        {/* 2x3 grid of large tile icons */}
        <div className="grid grid-cols-3 gap-2 px-4 mt-4">
          {(quickMenuOrder.length > 0 ? quickMenuOrder : ['주문', '스탬프', '선불카드', '이벤트', '매장찾기', '쿠폰']).map((feat) => {
            const Icon = FEATURE_ICON_MAP[feat] || CreditCard;
            return (
              <div
                key={feat}
                className="flex flex-col items-center justify-center gap-2 rounded-xl h-[100px]"
                style={{ backgroundColor: hexAlpha(brandColor, 0.08) }}
              >
                <Icon size={28} weight="fill" style={{ color: brandColor }} />
                <span className="text-[11px] font-medium text-text-secondary">
                  {feat}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-4" />
      </div>
    </>
  );
}

/* D-1: 배달카드형 - 전면 카드 */
function TemplateD1({ brandColor, brandName, bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl: _fabIconUrl, quickMenuOrder, onScreenChange }: TemplateProps) {
  return (
    <>
      <StatusBar />
      <Header variant="hamburger" brandColor={brandColor} brandName={brandName} showHeaderBI={showHeaderBI} headerLogoUrl={headerLogoUrl} />
      <div className="flex-1 overflow-y-auto phone-scroll">
        <div className="mt-2">
          <Banner brandColor={brandColor} bannerRatio={bannerRatio} />
        </div>
        {/* Address bar */}
        <AddressBar brandColor={brandColor} />
        {/* Two delivery cards side by side */}
        <div className="flex gap-3 px-4 mt-2">
          <DeliveryCard
            icon={CoffeeBean}
            title="Delivery"
            subtitle="배달하기"
            brandColor={brandColor}
          />
          <DeliveryCard
            icon={HandbagSimple}
            title="Take Out"
            subtitle="포장하기"
            brandColor={brandColor}
          />
        </div>
        {/* Quick menu: 연결된 버튼 행 (Figma D-1) */}
        <div className="flex mx-4 mt-4 border border-border rounded-lg overflow-hidden">
          {(quickMenuOrder.length > 0 ? quickMenuOrder : ['주문내역', '쿠폰', '스탬프', '이벤트']).map((feat, idx, arr) => (
            <button
              key={feat}
              type="button"
              onClick={() => onScreenChange?.(FEATURE_SCREEN_MAP[feat] || 'home')}
              className={`flex-1 py-3 text-[12px] font-medium text-text-secondary text-center ${idx < arr.length - 1 ? 'border-r border-border' : ''}`}
            >
              {feat}
            </button>
          ))}
        </div>
        <MenuSection variant="horizontal" showMore />
        <div className="h-4" />
      </div>
    </>
  );
}

/* D-2: 배달카드형 - 오버레이 팝업 */
function TemplateD2({ brandColor, brandName, bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl, quickMenuOrder, onScreenChange }: TemplateProps) {
  return (
    <>
      <StatusBar />
      <Header variant="clean" brandColor={brandColor} brandName={brandName} showHeaderBI={showHeaderBI} headerLogoUrl={headerLogoUrl} />
      <div className="flex-1 overflow-y-auto phone-scroll">
        <AddressBar brandColor={brandColor} />
        <div className="mt-2">
          <Banner brandColor={brandColor} bannerRatio={bannerRatio} />
        </div>
        <MenuSection variant="horizontal" showMore />
        <div className="h-4" />
      </div>
      <BottomTabBar brandColor={brandColor} quickMenuOrder={quickMenuOrder} orderIconUrl={fabIconUrl} onScreenChange={onScreenChange} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
type TemplateProps = {
  brandColor: string;
  brandName: string;
  bannerRatio: string;
  showHeaderBI: boolean;
  headerLogoUrl?: string | null;
  fabIconUrl?: string | null;
  quickMenuOrder: string[];
  onScreenChange?: (screen: string) => void;
};

export function PhoneMockup({
  templateId,
  brandColor,
  brandName,
  bannerRatio,
  activeScreen,
  showHeaderBI = true,
  headerLogoUrl,
  fabIconUrl,
  quickMenuOrder = [],
  onScreenChange,
  orderView,
}: PhoneMockupProps) {
  const common: TemplateProps = { brandColor, brandName, bannerRatio, showHeaderBI, headerLogoUrl, fabIconUrl, quickMenuOrder, onScreenChange };

  function renderContent() {
    if (activeScreen === 'order') {
      return <OrderScreen brandColor={brandColor} initialView={orderView} />;
    }
    if (activeScreen === 'coupon') {
      return <CouponScreen brandColor={brandColor} />;
    }
    if (activeScreen === 'stamp') {
      return <StampScreen brandColor={brandColor} />;
    }
    if (activeScreen === 'news') {
      return <NewsScreen brandColor={brandColor} />;
    }
    // 메인 홈 (기본) — 시안별 분기
    return renderTemplate();
  }

  function renderTemplate() {
    switch (templateId) {
      case 'A-1':
        return <TemplateA1 {...common} />;
      case 'A-2':
        return <TemplateA2 {...common} />;
      case 'B-1':
        return <TemplateB1 {...common} />;
      case 'B-2':
        return <TemplateB2 {...common} />;
      case 'B-3':
        return <TemplateB3 {...common} />;
      case 'C-1':
        return <TemplateC1 {...common} />;
      case 'C-2':
        return <TemplateC2 {...common} />;
      case 'C-4':
        return <TemplateC4 {...common} />;
      case 'D-1':
        return <TemplateD1 {...common} />;
      case 'D-2':
        return <TemplateD2 {...common} />;
      default:
        return <TemplateA1 {...common} />;
    }
  }

  return (
    <div className="relative w-[360px] h-[740px] rounded-[32px] bg-white shadow-2xl border border-border overflow-hidden flex flex-col">
      {renderContent()}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Membership Screen (멤버십 화면)
// ---------------------------------------------------------------------------

/** 쿠폰 아이템 */
function CouponItem({ brandColor, daysLeft, name }: { brandColor: string; daysLeft: number; name: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border-light">
      <div className="relative shrink-0">
        <div className="w-[60px] h-[60px] rounded-lg bg-gradient-to-br from-amber-100 to-orange-200" />
        <span
          className="absolute -top-1 -left-1 text-[9px] font-bold text-white px-1.5 py-0.5 rounded"
          style={{ backgroundColor: brandColor }}
        >
          {daysLeft}일 남음
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-text-muted">사용처</p>
        <p className="text-[13px] font-bold text-text-primary truncate">{name}</p>
        <p className="text-[11px] text-text-muted mt-0.5">유효기간 2025.12.31</p>
      </div>
    </div>
  );
}

/** 스탬프 카드 아이템 */
function StampCardItem({ brandColor, name, count, onClick }: { brandColor: string; name: string; count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl p-4 text-left"
      style={{ backgroundColor: brandColor }}
    >
      <p className="text-[10px] font-semibold text-white/70 tracking-wider">STAMP CARD</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[14px] font-bold text-white">{name}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-[22px] font-extrabold text-white">{count.toLocaleString()}</span>
          <span className="text-[12px] text-white/80">개</span>
        </div>
      </div>
    </button>
  );
}

/** 스탬프 상세 — 진행도 + 격자 */
function StampDetail({ brandColor, onBack: _onBack }: { brandColor: string; onBack: () => void }) {
  const filled = 5;
  const total = 10;
  return (
    <div className="flex-1 overflow-y-auto phone-scroll">
      {/* Progress header */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-[10px]" style={{ color: brandColor }}>★</span>
            <span className="text-[22px] font-extrabold text-text-primary">{filled}</span>
            <span className="text-[14px] text-text-muted">/{total}</span>
          </div>
          <span className="text-[12px] text-text-muted">쿠폰 발급까지 스탬프 {total - filled}장</span>
        </div>
        <div className="w-full h-2 rounded-full bg-border overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${(filled / total) * 100}%`, backgroundColor: brandColor }} />
        </div>
      </div>
      {/* 적립내역 보기 */}
      <div className="px-4 mt-4">
        <button type="button" className="text-[12px] font-semibold text-text-primary border border-border rounded-lg px-3 py-1.5">
          적립내역 보기
        </button>
      </div>
      {/* Stamp grid 5x2 */}
      <div className="mx-4 mt-4 rounded-xl p-5" style={{ backgroundColor: brandColor }}>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-full ${i < filled ? 'bg-white/30' : 'bg-white/10'} flex items-center justify-center`}>
                {i < filled && <Stamp size={18} weight="fill" className="text-white" />}
              </div>
              <span className="text-[9px] text-white/60">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 유의사항 */}
      <div className="px-4 mt-5 pb-6">
        <p className="text-[12px] font-semibold text-text-primary mb-2">유의사항</p>
        <div className="text-[10px] text-text-muted leading-4 space-y-1">
          <p>제조 음료 1잔당 1개의 스탬프를 적립해드립니다</p>
          <p>스탬프 유효기간: 적립일 ~ 3개월, 쿠폰 유효기간: 발급일 ~ 3개월</p>
          <p>스탬프 10개를 적립하시면 쿠폰이 자동으로 발행됩니다</p>
          <p>스탬프 적립 내역은 최근 6개월, 쿠폰 내역은 최근 3개월까지 확인할 수 있습니다</p>
        </div>
      </div>
    </div>
  );
}

/** 쿠폰함 화면 (독립 진입) */
function CouponScreen({ brandColor }: { brandColor: string }) {
  const [couponTab, setCouponTab] = useState(0);
  const couponTabs = ['보유 쿠폰', '쿠폰 다운로드', '쿠폰 히스토리'];
  const coupons = [
    { name: '아메리카노 쿠폰', days: 5 },
    { name: '여름 세일 쿠폰', days: 15 },
    { name: '신규 가입 쿠폰', days: 10 },
    { name: '특별 할인 쿠폰', days: 1 },
  ];

  return (
    <>
      <StatusBar />
      <div className="flex items-center justify-between px-4 h-[54px] shrink-0 border-b border-border">
        <div className="w-8" />
        <span className="text-[15px] font-bold text-text-primary">쿠폰함</span>
        <div className="w-8" />
      </div>
      <div className="flex-1 overflow-y-auto phone-scroll">
        {/* Chip tabs */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto phone-scroll">
          {couponTabs.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setCouponTab(i)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-colors ${
                couponTab === i
                  ? 'text-white border-transparent'
                  : 'text-text-muted border-border'
              }`}
              style={couponTab === i ? { backgroundColor: brandColor } : {}}
            >
              {t} {i < 2 ? i + 1 : ''}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <span className="text-[12px] text-text-secondary">사용가능 쿠폰 {coupons.length}장</span>
          <span className="text-[11px] text-text-muted">등록순 ▾</span>
        </div>
        {coupons.map((c, i) => (
          <CouponItem key={i} brandColor={brandColor} daysLeft={c.days} name={c.name} />
        ))}
      </div>
    </>
  );
}

/** 스탬프 화면 (독립 진입) */
function StampScreen({ brandColor }: { brandColor: string }) {
  const [view, setView] = useState<'list' | 'detail'>('list');

  return (
    <>
      <StatusBar />
      <div className="flex items-center justify-between px-4 h-[54px] shrink-0 border-b border-border">
        <button type="button" onClick={() => setView('list')} className="w-8">
          {view === 'detail' ? (
            <CaretRight size={20} className="text-text-primary rotate-180" />
          ) : (
            <div className="w-5" />
          )}
        </button>
        <span className="text-[15px] font-bold text-text-primary">스탬프카드</span>
        <div className="w-8" />
      </div>
      {view === 'list' ? (
        <div className="flex-1 overflow-y-auto phone-scroll">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[12px] text-text-secondary">스탬프카드 2장</span>
            <span className="text-[11px] text-text-muted">등록순 ▾</span>
          </div>
          <div className="flex flex-col gap-3 px-4">
            <StampCardItem brandColor={brandColor} name="코코넛 카페" count={5} onClick={() => setView('detail')} />
            <StampCardItem brandColor={brandColor} name="우리동네 베이커리" count={3} onClick={() => setView('detail')} />
          </div>
        </div>
      ) : (
        <StampDetail brandColor={brandColor} onBack={() => setView('list')} />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Order Screen (오더 화면)
// 플로우: 매장선택 → 상품리스트 → 상세페이지 → 장바구니/결제
// ---------------------------------------------------------------------------

const STORES = [
  { id: 1, name: '코엑스점', address: '서울특별시 강남구 영동대로 513', distance: '500m', favorite: true },
  { id: 2, name: '역삼점', address: '서울특별시 강남구 역삼로 123', distance: '800m', favorite: false },
  { id: 3, name: '서현역점', address: '경기 성남시 분당구 서현로 210', distance: '1.2km', favorite: false },
];

const ORDER_CATEGORIES = ['추천', '커피', '논커피', '에이드', '스무디', '디저트'];

const ORDER_MENUS: Record<string, { name: string; price: number; desc: string }[]> = {
  '추천': [
    { name: '시나몬 애플티', price: 5600, desc: '사과와 시나몬의 달콤한 조화' },
    { name: '아이스 아메리카노', price: 4500, desc: '깔끔한 에스프레소 블렌드' },
    { name: '카페라떼', price: 5000, desc: '부드러운 우유와 에스프레소' },
    { name: '딸기 스무디', price: 5800, desc: '신선한 딸기의 상큼함' },
  ],
  '커피': [
    { name: '아이스 아메리카노', price: 4500, desc: '깔끔한 에스프레소 블렌드' },
    { name: '카페라떼', price: 5000, desc: '부드러운 우유와 에스프레소' },
    { name: '바닐라 라떼', price: 5500, desc: '달콤한 바닐라 향' },
    { name: '카라멜 마키아또', price: 5800, desc: '카라멜 드리즐 토핑' },
  ],
  '논커피': [
    { name: '초코 라떼', price: 5200, desc: '진한 초콜릿과 우유' },
    { name: '그린티 라떼', price: 5500, desc: '고소한 말차와 우유' },
    { name: '고구마 라떼', price: 5000, desc: '달콤한 고구마 풍미' },
  ],
};

interface MenuItem { name: string; price: number; desc: string }
interface CartItem extends MenuItem { qty: number; options: string }

type OrderView = 'store' | 'menu' | 'detail' | 'cart' | 'payment';

/** 상품리스트 — 3-column vertical grid */
function OrderMenuView({ brandColor, menus, activeCategory, onBack, onCategoryChange, onMenuSelect, selectedStore, onCartOpen, totalQty }: {
  brandColor: string; menus: MenuItem[]; activeCategory: string;
  onBack: () => void; onCategoryChange: (c: string) => void; onMenuSelect: (m: MenuItem) => void;
  selectedStore: string; onCartOpen: () => void; totalQty: number;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-[54px] shrink-0 border-b border-border">
        <button type="button" onClick={onBack} className="w-8">
          <CaretRight size={20} className="text-text-primary rotate-180" />
        </button>
        <span className="text-[15px] font-bold text-text-primary">상품리스트</span>
        <button type="button" className="w-8 flex items-center justify-center">
          <ArrowClockwise size={20} className="text-text-primary" />
        </button>
      </div>
      {/* Category chip tabs */}
      <div className="flex gap-1.5 px-3 py-2.5 overflow-x-auto phone-scroll shrink-0">
        {ORDER_CATEGORIES.map((cat) => (
          <button key={cat} type="button" onClick={() => onCategoryChange(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${activeCategory === cat ? 'text-white border-transparent' : 'text-text-muted border-border'}`}
            style={activeCategory === cat ? { backgroundColor: brandColor } : {}}
          >{cat}</button>
        ))}
      </div>
      {/* Sub-header row */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
        <span className="text-[13px] text-text-secondary">전체 {menus.length}개</span>
        <span className="text-[13px] text-text-muted flex items-center gap-0.5">품절상품 제외 <ArrowDown size={12} /></span>
      </div>
      {/* 3-column grid */}
      <div className="flex-1 overflow-y-auto phone-scroll px-4 pb-16">
        <div className="grid grid-cols-3 gap-x-4 gap-y-5">
          {menus.map((item, i) => (
            <button key={i} type="button" onClick={() => onMenuSelect(item)} className="flex flex-col items-center text-center">
              <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-amber-100 to-orange-200" />
              <p className="text-[13px] font-medium text-text-primary leading-tight mt-2">{item.name}</p>
              <p className="text-[13px] font-medium text-text-primary mt-0.5">{item.price.toLocaleString()}원</p>
              <div className="flex gap-1 justify-center mt-1">
                <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-red-400 text-red-400 font-bold">레이블</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full border border-red-400 text-red-400 font-bold">레이블</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Bottom fixed bar */}
      <div className="h-[56px] border-t border-border flex items-center justify-between px-4 shrink-0 bg-white">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-text-primary">{selectedStore}</span>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }} />
        </div>
        <button type="button" onClick={onCartOpen} className="relative">
          <ShoppingBag size={22} className="text-text-primary" />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: brandColor }}>
              {totalQty}
            </span>
          )}
        </button>
      </div>
    </>
  );
}

/** 상세페이지 — radio/checkbox, accordion */
function OrderDetailView({ brandColor, menu, quantity, totalQty, onQuantityChange, onAddToCart, onBuyNow, onBack, onCartOpen }: {
  brandColor: string; menu: MenuItem; quantity: number; totalQty: number;
  onQuantityChange: (q: number) => void; onAddToCart: (temp: string, shot: string, extras: string[]) => void; onBuyNow: (temp: string, shot: string, extras: string[]) => void;
  onBack: () => void; onCartOpen: () => void;
}) {
  const [tempOpt, setTempOpt] = useState<string>('HOT');
  const [shotOpt, setShotOpt] = useState<string>('얼음 없이');
  const [personalOpen, setPersonalOpen] = useState(false);
  const [syrupExtras, setSyrupExtras] = useState<Set<string>>(new Set());

  const toggleSyrup = (e: string) => {
    setSyrupExtras((prev) => {
      const next = new Set(prev);
      if (next.has(e)) next.delete(e); else next.add(e);
      return next;
    });
  };

  const shotExtra = shotOpt === '얼음 많이' ? 500 : 0;
  const unitPrice = menu.price + shotExtra;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-[54px] shrink-0">
        <button type="button" onClick={onBack} className="w-8">
          <CaretRight size={20} className="text-text-primary rotate-180" />
        </button>
        <div className="w-8" />
        <button type="button" onClick={onCartOpen} className="relative w-8 flex items-center justify-center">
          <ShoppingBag size={20} className="text-text-primary" />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: brandColor }}>
              {totalQty}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto phone-scroll">
        {/* Product image area */}
        <div className="w-full bg-warm-white flex items-center justify-center" style={{ height: 200 }}>
          <div className="w-[130px] h-[130px] rounded-lg bg-gradient-to-br from-amber-100 to-orange-200" />
        </div>
        {/* Product name + description */}
        <div className="px-4 pt-4 pb-5 text-center">
          <p className="text-[18px] font-bold text-text-primary">{menu.name}</p>
          <p className="text-[13px] text-text-muted mt-2 leading-5">{menu.desc}</p>
        </div>

        {/* 온도 section */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-[13px] font-bold text-text-primary mb-1">온도</p>
          {['HOT', 'ICE'].map((opt) => (
            <button key={opt} type="button" onClick={() => setTempOpt(opt)}
              className="w-full flex items-center gap-3 h-[40px] text-left"
            >
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: tempOpt === opt ? brandColor : '#E4E4E0' }}
              >
                {tempOpt === opt && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brandColor }} />}
              </div>
              <span className={`text-[14px] ${tempOpt === opt ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{opt}</span>
            </button>
          ))}
        </div>

        {/* 샷 선택 section */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-[13px] font-bold text-text-primary mb-1">샷 선택</p>
          {[{ label: '얼음 없이', extra: 0 }, { label: '얼음 많이', extra: 500 }].map((opt) => (
            <button key={opt.label} type="button" onClick={() => setShotOpt(opt.label)}
              className="w-full flex items-center justify-between h-[40px] text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: shotOpt === opt.label ? brandColor : '#E4E4E0' }}
                >
                  {shotOpt === opt.label && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brandColor }} />}
                </div>
                <span className={`text-[14px] ${shotOpt === opt.label ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{opt.label}</span>
              </div>
              {opt.extra > 0 && <span className="text-[12px] text-text-muted">+{opt.extra.toLocaleString()}원</span>}
            </button>
          ))}
        </div>

        {/* 퍼스널 옵션 accordion */}
        <div className="px-4 pt-3 pb-3">
          <button type="button" onClick={() => setPersonalOpen(!personalOpen)} className="w-full flex items-center justify-between py-2">
            <span className="text-[13px] font-bold text-text-primary">퍼스널 옵션</span>
            <ArrowDown size={16} className={`text-text-muted transition-transform ${personalOpen ? 'rotate-180' : ''}`} />
          </button>
          {personalOpen && (
            <div className="mt-1">
              <p className="text-[12px] text-text-muted mb-1">시럽</p>
              {['설탕시럽 추가', '헤이즐넛 시럽 추가'].map((opt) => {
                const checked = syrupExtras.has(opt);
                return (
                  <button key={opt} type="button" onClick={() => toggleSyrup(opt)}
                    className="w-full flex items-center gap-3 h-[40px] text-left"
                  >
                    <div className="w-5 h-5 rounded-sm border flex items-center justify-center shrink-0"
                      style={{ borderColor: checked ? brandColor : '#E4E4E0', backgroundColor: checked ? brandColor : 'transparent' }}
                    >
                      {checked && <Check size={12} weight="bold" className="text-white" />}
                    </div>
                    <span className={`text-[14px] ${checked ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom fixed area (126px) */}
      <div className="shrink-0 px-4 pt-3 pb-3" style={{ height: 126 }}>
        {/* Row 1: quantity + price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => onQuantityChange(Math.max(1, quantity - 1))} className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-text-secondary text-[14px] font-bold">−</button>
            <span className="text-[15px] font-bold text-text-primary w-5 text-center">{quantity}</span>
            <button type="button" onClick={() => onQuantityChange(quantity + 1)} className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[14px] font-bold" style={{ backgroundColor: brandColor }}>+</button>
          </div>
          <span className="text-[18px] font-extrabold text-text-primary">{(unitPrice * quantity).toLocaleString()}원</span>
        </div>
        {/* Row 2: buttons */}
        <div className="flex gap-2">
          <button type="button" onClick={() => onAddToCart(tempOpt, shotOpt, Array.from(syrupExtras))} className="flex-1 py-3 rounded-xl border border-border text-[14px] font-bold text-text-primary">담기</button>
          <button type="button" onClick={() => onBuyNow(tempOpt, shotOpt, Array.from(syrupExtras))} className="flex-1 py-3 rounded-xl text-white text-[14px] font-bold" style={{ backgroundColor: brandColor }}>주문하기</button>
        </div>
      </div>
    </>
  );
}

function OrderScreen({ brandColor, initialView }: { brandColor: string; initialView?: string }) {
  const [view, setView] = useState<OrderView>((initialView as OrderView) || 'store');
  const [storeTab, setStoreTab] = useState<'nearby' | 'my'>('nearby');
  const [selectedStore, setSelectedStore] = useState('서현역점');
  const [activeCategory, setActiveCategory] = useState('추천');
  // detail/cart/payment 캡처용: 기본 메뉴 세팅
  const defaultMenu = ORDER_MENUS['추천'][0];
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(
    initialView === 'detail' ? defaultMenu : null,
  );
  const [quantity, setQuantity] = useState(1);
  const defaultCart: CartItem[] = initialView === 'cart' || initialView === 'payment'
    ? [{ ...ORDER_MENUS['추천'][0], qty: 1, options: 'ICE / 얼음 많이' }, { ...ORDER_MENUS['추천'][1], qty: 2, options: 'HOT' }]
    : [];
  const [cart, setCart] = useState<CartItem[]>(defaultCart);

  const menus = ORDER_MENUS[activeCategory] || ORDER_MENUS['추천'];
  const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const totalQty = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (temp: string, shot: string, extras: string[]) => {
    if (!selectedMenu) return;
    const optionStr = [temp, shot, ...extras].filter(Boolean).join(', ');
    const shotExtra = shot === '얼음 많이' ? 500 : 0;
    const itemPrice = selectedMenu.price + shotExtra;
    setCart((prev) => {
      const key = selectedMenu.name + '|' + optionStr;
      const exists = prev.find((c) => c.name + '|' + c.options === key);
      if (exists) return prev.map((c) => (c.name + '|' + c.options === key) ? { ...c, qty: c.qty + quantity } : c);
      return [...prev, { ...selectedMenu, price: itemPrice, qty: quantity, options: optionStr }];
    });
    setSelectedMenu(null);
    setQuantity(1);
    setView('menu');
  };

  const goBack = () => {
    if (view === 'menu') setView('store');
    else if (view === 'detail') { setView('menu'); setSelectedMenu(null); setQuantity(1); }
    else if (view === 'cart') setView('menu');
    else if (view === 'payment') setView('cart');
  };

  return (
    <>
      <StatusBar />

      {/* ── 1. 매장선택 ── */}
      {view === 'store' && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-[54px] shrink-0 border-b border-border">
            <div className="w-8" />
            <span className="text-[15px] font-bold text-text-primary">매장리스트</span>
            <div className="w-8" />
          </div>
          {/* Chip tabs */}
          <div className="flex gap-2 px-4 py-3 shrink-0">
            <button type="button" onClick={() => setStoreTab('nearby')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${storeTab === 'nearby' ? 'text-white border-transparent' : 'text-text-muted border-border'}`}
              style={storeTab === 'nearby' ? { backgroundColor: brandColor } : {}}
            >주변매장</button>
            <button type="button" onClick={() => setStoreTab('my')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${storeTab === 'my' ? 'text-white border-transparent' : 'text-text-muted border-border'}`}
              style={storeTab === 'my' ? { backgroundColor: brandColor } : {}}
            >MY매장</button>
          </div>
          {/* Store list */}
          <div className="flex-1 overflow-y-auto phone-scroll">
            {STORES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setSelectedStore(s.name); setView('menu'); }}
                className="w-full flex items-start gap-3 px-4 border-b border-border-light text-left"
                style={{ height: 104 }}
              >
                {/* Left: image placeholder + star badge */}
                <div className="relative shrink-0 mt-5">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                    <Camera size={20} className="text-gray-400" />
                  </div>
                  {/* Star badge bottom-left */}
                  <div className="absolute -bottom-1 -left-1">
                    <Star size={16} weight="fill" style={{ color: s.favorite ? '#F59E0B' : '#D1D5DB' }} />
                  </div>
                </div>
                {/* Right: info */}
                <div className="flex-1 min-w-0 pt-5">
                  <p className="text-[15px] font-bold text-text-primary">{s.name}</p>
                  <p className="text-[13px] text-text-muted mt-1 truncate">{s.address}</p>
                  <p className="text-[13px] text-text-muted mt-0.5">{s.distance}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── 2. 상품리스트 ── */}
      {view === 'menu' && (
        <OrderMenuView
          brandColor={brandColor}
          menus={menus}
          activeCategory={activeCategory}
          onBack={goBack}
          onCategoryChange={setActiveCategory}
          onMenuSelect={(item) => { setSelectedMenu(item); setView('detail'); }}
          selectedStore={selectedStore}
          onCartOpen={() => setView('cart')}
          totalQty={totalQty}
        />
      )}

      {/* ── 3. 상세페이지 ── */}
      {view === 'detail' && selectedMenu && (
        <OrderDetailView
          brandColor={brandColor}
          menu={selectedMenu}
          quantity={quantity}
          totalQty={totalQty}
          onQuantityChange={setQuantity}
          onAddToCart={(temp, shot, extras) => addToCart(temp, shot, extras)}
          onBuyNow={(temp, shot, extras) => { addToCart(temp, shot, extras); setView('cart'); }}
          onBack={goBack}
          onCartOpen={() => setView('cart')}
        />
      )}

      {/* ── 4. 장바구니 ── */}
      {view === 'cart' && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-[54px] shrink-0 border-b border-border">
            <button type="button" onClick={goBack} className="w-8">
              <CaretRight size={20} className="text-text-primary rotate-180" />
            </button>
            <span className="text-[15px] font-bold text-text-primary">주문하기</span>
            <div className="w-8" />
          </div>
          {/* Store name bar */}
          <div className="w-full h-[40px] flex items-center justify-center shrink-0" style={{ backgroundColor: brandColor }}>
            <span className="text-[14px] font-semibold text-white">{selectedStore}</span>
          </div>
          <div className="flex-1 overflow-y-auto phone-scroll">
            {/* Section label */}
            <div className="px-4 pt-4 pb-2">
              <span className="text-[14px] font-bold text-text-primary">주문 상품</span>
            </div>
            {cart.length === 0 ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-[13px] text-text-muted">장바구니가 비어있습니다</p>
              </div>
            ) : (
              cart.map((item, i) => (
                <div key={i} className="relative flex items-start gap-3 px-4 py-3 border-b border-border-light">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 shrink-0" />
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-text-primary">{item.name}</p>
                    {item.options && <p className="text-[12px] text-text-muted mt-0.5">{item.options}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setCart(cart.map((c, ci) => ci === i ? { ...c, qty: Math.max(1, c.qty - 1) } : c))} className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-[12px] text-text-secondary font-bold">−</button>
                        <span className="text-[13px] font-bold text-text-primary w-4 text-center">{item.qty}</span>
                        <button type="button" onClick={() => setCart(cart.map((c, ci) => ci === i ? { ...c, qty: c.qty + 1 } : c))} className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px] font-bold" style={{ backgroundColor: brandColor }}>+</button>
                      </div>
                      <span className="text-[14px] font-bold text-text-primary">{(item.price * item.qty).toLocaleString()}원</span>
                    </div>
                  </div>
                  {/* Delete button */}
                  <button type="button" onClick={() => setCart(cart.filter((_, ci) => ci !== i))} className="absolute top-3 right-4">
                    <X size={16} className="text-text-muted" />
                  </button>
                </div>
              ))
            )}
          </div>
          {/* Bottom fixed area */}
          {cart.length > 0 && (
            <div className="shrink-0 border-t border-border px-4 pt-3 pb-3">
              <p className="text-[12px] text-text-muted text-center mb-2">장바구니에 담으신 상품은 최대 30일간 보관됩니다.</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-text-secondary">상품금액</span>
                <span className="text-[14px] font-bold text-text-primary">{totalPrice.toLocaleString()}원</span>
              </div>
              <button type="button" onClick={() => setView('payment')} className="w-full rounded-xl text-white text-[15px] font-bold flex items-center justify-center" style={{ backgroundColor: brandColor, height: 50 }}>
                주문하기
              </button>
            </div>
          )}
        </>
      )}

      {/* ── 5. 결제 ── */}
      {view === 'payment' && (
        <OrderPaymentView brandColor={brandColor} storeName={selectedStore} cart={cart} totalPrice={totalPrice} />
      )}
    </>
  );
}

/** 결제 화면 (Figma: 결제) */
function OrderPaymentView({ brandColor, storeName, cart, totalPrice }: {
  brandColor: string; storeName: string; cart: CartItem[]; totalPrice: number;
}) {
  const [packCheck, setPackCheck] = useState(true);
  const [payMethod, setPayMethod] = useState('신용카드');
  const [agreeAll, setAgreeAll] = useState(false);
  const [agrees, setAgrees] = useState([false, false, false]);
  const discount = 2000;
  const finalPrice = totalPrice - discount;

  const toggleAgree = (idx: number) => {
    const next = [...agrees];
    next[idx] = !next[idx];
    setAgrees(next);
    setAgreeAll(next.every(Boolean));
  };
  const toggleAgreeAll = () => {
    const val = !agreeAll;
    setAgreeAll(val);
    setAgrees([val, val, val]);
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto phone-scroll">
        {/* 매장명 바 */}
        <div className="w-full h-[40px] flex items-center px-4 shrink-0 bg-warm-white">
          <span className="text-[14px] font-bold text-text-primary">{storeName}</span>
        </div>

        {/* 주문 상품 */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-text-primary">주문 상품</span>
            <ArrowDown size={18} className="text-text-muted" />
          </div>
          {cart.map((item, i) => (
            <div key={i} className="flex items-start gap-3 mt-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 shrink-0 flex items-center justify-center">
                <Camera size={14} className="text-text-disabled" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[13px] font-semibold text-text-primary">{item.name}</p>
                    {item.options && <p className="text-[11px] text-text-muted">{item.options}</p>}
                  </div>
                  <X size={14} className="text-text-muted shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[12px] text-text-primary font-medium">{item.qty}개</span>
                  <span className="text-[13px] font-bold text-text-primary">{(item.price * item.qty).toLocaleString()}원</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 요청사항 */}
        <div className="px-4 py-3">
          <span className="text-[13px] font-bold text-text-primary">요청사항</span>
          <p className="text-[12px] text-text-muted mt-1">매장 요청사항</p>
          <div className="mt-1.5 border border-border rounded-lg px-3 py-2">
            <span className="text-[12px] text-text-disabled">매장 요청사항을 적어주세요</span>
          </div>
        </div>

        {/* 포장 요청 */}
        <div className="px-4 py-3">
          <span className="text-[13px] font-bold text-text-primary">포장 요청</span>
          <button type="button" onClick={() => setPackCheck(!packCheck)} className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
              style={{ backgroundColor: packCheck ? brandColor : 'transparent', border: packCheck ? 'none' : '2px solid #E4E4E0' }}
            >
              {packCheck && <Check size={12} weight="bold" className="text-white" />}
            </div>
            <span className="text-[13px] text-text-primary">포장해주세요</span>
          </button>
        </div>

        {/* 할인 적용 */}
        <div className="px-4 py-3">
          <span className="text-[13px] font-bold text-text-primary">할인 적용</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[12px] text-text-secondary">선물</span>
            <div className="flex items-center gap-1">
              <span className="text-[12px] text-text-muted">쿠폰 적용 및 할인 전달해주세요.</span>
              <CaretRight size={14} className="text-text-muted" />
            </div>
          </div>
        </div>

        {/* 결제수단 (radio) */}
        <div className="px-4 py-3">
          <span className="text-[13px] font-bold text-text-primary mb-2 block">결제수단</span>
          {['신용카드', '선불카드', '간편카드 결제'].map((method) => (
            <button key={method} type="button" onClick={() => setPayMethod(method)} className="w-full flex items-center gap-3 py-2 text-left">
              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{ borderColor: payMethod === method ? brandColor : '#E4E4E0' }}
              >
                {payMethod === method && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: brandColor }} />}
              </div>
              <span className={`text-[13px] ${payMethod === method ? 'font-semibold text-text-primary' : 'text-text-secondary'}`}>{method}</span>
            </button>
          ))}
        </div>

        {/* 금액 요약 */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-[12px] text-text-secondary">상품금액</span>
            <span className="text-[13px] text-text-primary">{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[12px] text-text-secondary">할인금액</span>
            <span className="text-[13px]" style={{ color: brandColor }}>-{discount.toLocaleString()}원</span>
          </div>
          <div className="flex items-center justify-between py-1 mt-1">
            <span className="text-[13px] font-bold text-text-primary">결제금액</span>
            <span className="text-[18px] font-extrabold" style={{ color: brandColor }}>{finalPrice.toLocaleString()}원</span>
          </div>
        </div>

        {/* 약관 동의 (checkbox) */}
        <div className="px-4 py-3">
          <button type="button" onClick={toggleAgreeAll} className="w-full flex items-center gap-2 py-1.5">
            <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
              style={{ backgroundColor: agreeAll ? brandColor : 'transparent', border: agreeAll ? 'none' : '2px solid #E4E4E0' }}
            >
              {agreeAll && <Check size={12} weight="bold" className="text-white" />}
            </div>
            <span className="text-[12px] font-semibold text-text-primary">주문상품정보 및 결제대행 서비스 이용약관에 동의</span>
            <ArrowDown size={14} className="text-text-muted ml-auto" />
          </button>
          {[
            { label: '오더 서비스 이용약관(필수)', required: true },
            { label: '제 3자 개인정보 활용 동의(필수)', required: true },
            { label: '마케팅 활용 동의(선택)', required: false },
          ].map((item, i) => (
            <button key={i} type="button" onClick={() => toggleAgree(i)} className="w-full flex items-center gap-2 py-1.5 pl-7">
              <Check size={16} weight="bold" style={{ color: agrees[i] ? brandColor : '#C4C4C0' }} />
              <span className="text-[11px] text-text-secondary">{item.label}</span>
            </button>
          ))}
        </div>

        {/* 안내 문구 */}
        <div className="px-4 pb-3">
          <p className="text-[10px] text-text-muted leading-4">
            결제 완료된 주문 메뉴의 경우, 주문접수 전이라면 고객 주문 취소가 가능합니다.
            자동 주문접수 매장의 경우 결제 완료와 동시에 제조되므로 주문 변경/취소가 불가합니다.
          </p>
          <p className="text-[11px] font-semibold text-text-primary mt-2">
            주문 <span style={{ color: brandColor }}>접수 후 취소 불가</span>합니다.
          </p>
        </div>
      </div>

      {/* 하단 결제 버튼 */}
      <div className="shrink-0 border-t border-border px-4 py-3">
        <p className="text-[11px] text-text-muted text-center mb-2">
          {finalPrice.toLocaleString()}원을 결제합니다
        </p>
        <button type="button" className="w-full rounded-xl text-white text-[15px] font-bold flex items-center justify-center" style={{ backgroundColor: brandColor, height: 50 }}>
          주문하기
        </button>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// News Screen (새소식 화면)
// ---------------------------------------------------------------------------

const EVENTS = [
  { id: 1, title: '다이어트 간편식 인증 챌린지 이벤트', period: '2025. 03. 01. ~ 2025. 03. 31.', ended: false },
  { id: 2, title: '봄맞이 신메뉴 출시 이벤트', period: '2025. 02. 01. ~ 2025. 02. 28.', ended: true },
  { id: 3, title: '카카오톡 채널 추가 이벤트', period: '2025. 01. 15. ~ 2025. 01. 31.', ended: true },
];

const NOTICES = [
  { id: 1, title: '역삼점 신규 매장 오픈 안내', date: '2025. 01. 02.' },
  { id: 2, title: '설 연휴 매장 운영시간 안내', date: '2025. 01. 20.' },
  { id: 3, title: '개인정보 처리방침 변경 안내', date: '2025. 01. 15.' },
  { id: 4, title: '포인트 적립 정책 변경 안내', date: '2025. 01. 10.' },
  { id: 5, title: '앱 업데이트 안내 (v2.1.0)', date: '2025. 01. 05.' },
];

type NewsTab = 'event' | 'notice';

interface NewsDetailData {
  type: NewsTab;
  title: string;
  date: string;
}

function NewsScreen({ brandColor }: { brandColor: string }) {
  const [tab, setTab] = useState<NewsTab>('event');
  const [detail, setDetail] = useState<NewsDetailData | null>(null);

  if (detail) {
    return (
      <>
        <StatusBar />
        <div className="flex items-center justify-between px-4 h-[54px] shrink-0 border-b border-border">
          <button type="button" onClick={() => setDetail(null)} className="w-8">
            <CaretRight size={20} className="text-text-primary rotate-180" />
          </button>
          <span className="text-[15px] font-bold text-text-primary">
            {detail.type === 'event' ? '이벤트' : '공지사항'}
          </span>
          <div className="w-8" />
        </div>
        <div className="flex-1 overflow-y-auto phone-scroll">
          {/* Title + date */}
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <p className="text-[15px] font-bold text-text-primary leading-6">{detail.title}</p>
            <p className="text-[12px] text-text-muted mt-1">{detail.date}</p>
          </div>
          {/* Body */}
          <div className="px-4 pt-4">
            <p className="text-[13px] text-text-secondary leading-5">
              바쁜 직장인 다이어터이신가요?{'\n'}점심에 간편식 챌린지 인증하고 기운 받아가세요!
            </p>
          </div>
          {/* Image placeholder */}
          <div className="mx-4 mt-4 h-[300px] rounded-lg bg-gradient-to-b from-gray-100 to-gray-200" />
        </div>
      </>
    );
  }

  return (
    <>
      <StatusBar />
      <div className="flex items-center justify-between px-4 h-[54px] shrink-0 border-b border-border">
        <div className="w-8" />
        <span className="text-[15px] font-bold text-text-primary">새소식</span>
        <div className="w-8" />
      </div>
      {/* Chip tabs: 이벤트 / 공지사항 */}
      <div className="flex gap-2 px-4 py-3 shrink-0">
        <button
          type="button"
          onClick={() => setTab('event')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${
            tab === 'event' ? 'text-white border-transparent' : 'text-text-muted border-border'
          }`}
          style={tab === 'event' ? { backgroundColor: brandColor } : {}}
        >
          이벤트
        </button>
        <button
          type="button"
          onClick={() => setTab('notice')}
          className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors ${
            tab === 'notice' ? 'text-white border-transparent' : 'text-text-muted border-border'
          }`}
          style={tab === 'notice' ? { backgroundColor: brandColor } : {}}
        >
          공지사항
        </button>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto phone-scroll">
        {tab === 'event' ? (
          <div className="flex flex-col gap-5 px-4 pb-4">
            {EVENTS.map((ev) => (
              <button
                key={ev.id}
                type="button"
                onClick={() => setDetail({ type: 'event', title: ev.title, date: ev.period })}
                className="text-left"
              >
                <div className="relative w-full h-[140px] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {ev.ended && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-[13px] font-semibold text-white">종료된 이벤트입니다.</span>
                    </div>
                  )}
                </div>
                <p className="text-[14px] font-semibold text-text-primary mt-2 leading-5">{ev.title}</p>
                <p className="text-[12px] text-text-muted mt-0.5">{ev.period}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col">
            {NOTICES.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setDetail({ type: 'notice', title: n.title, date: n.date })}
                className="text-left px-4 py-4 border-b border-border-light"
              >
                <p className="text-[14px] font-semibold text-text-primary leading-5">{n.title}</p>
                <p className="text-[12px] text-text-muted mt-1">{n.date}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default PhoneMockup;
