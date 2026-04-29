/**
 * GA4 클릭 이벤트 위임 핸들러.
 *
 * 컴포넌트 onClick을 손대지 않고, JSX의 `data-ga-*` 속성만으로
 * GA4 권장 이벤트(`select_content` / `share` 등)를 자동 발송합니다.
 *
 * 사용 예시 (마크업):
 *   <button
 *     data-ga-event="select_content"
 *     data-ga-param-content-type="template"
 *     data-ga-param-item-id="B-2"
 *     data-ga-param-item-category="recommend_primary"
 *   >...</button>
 *
 * 발송되는 GA4 이벤트:
 *   gtag('event', 'select_content', {
 *     content_type: 'template',
 *     item_id: 'B-2',
 *     item_category: 'recommend_primary',
 *   })
 *
 * 변환 규칙: `data-ga-param-{kebab-case}` → params.{snake_case}
 *   data-ga-param-content-type   → content_type
 *   data-ga-param-item-id        → item_id
 *   data-ga-param-item-category2 → item_category2
 *
 * `data-ga-event`이 생략된 요소는 무시됩니다 (기본값 적용 안 함).
 * 정의서: https://waldlust.getoutline.com/doc/ga4-cta-YwTbTZ3IEx
 */

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
    dataLayer?: unknown[];
  }
}

/** dataset 키(camelCase) → GA4 파라미터 키(snake_case) */
function datasetKeyToParam(key: string): string {
  // 'gaParamContentType' → 'ContentType' → 'contentType' → 'content_type'
  const after = key.slice('gaParam'.length);
  if (!after) return '';
  return after
    .replace(/^./, (c) => c.toLowerCase())
    .replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
}

export function initGA4Delegation(): void {
  if (typeof document === 'undefined') return;

  document.addEventListener(
    'click',
    (e) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest) return;

      const el = target.closest<HTMLElement>('[data-ga-event]');
      if (!el) return;

      const eventName = el.dataset.gaEvent;
      if (!eventName) return;

      const params: Record<string, string> = {};
      for (const key in el.dataset) {
        if (!key.startsWith('gaParam')) continue;
        const paramKey = datasetKeyToParam(key);
        if (!paramKey) continue;
        const value = el.dataset[key];
        if (value !== undefined && value !== '') {
          params[paramKey] = value;
        }
      }

      window.gtag?.('event', eventName, params);
    },
    { passive: true, capture: true },
  );
}
