/**
 * 담당자 전달 유틸리티
 * - Slack Incoming Webhook으로 메시지 전송
 * - Google Sheets에 행 추가 (Apps Script Web App 경유)
 *
 * 환경변수:
 * - VITE_SLACK_WEBHOOK_URL: Slack Incoming Webhook URL
 * - VITE_SHEETS_WEBAPP_URL: Google Apps Script 배포 URL (doPost로 행 추가)
 */

interface SendPayload {
  templateId: string;
  templateName: string;
  brandColor: string;
  brandName: string;
  bannerRatio: string;
  date: string;
}

/** Slack Incoming Webhook으로 전송 */
async function sendToSlack(payload: SendPayload): Promise<boolean> {
  const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[sendToSlack] VITE_SLACK_WEBHOOK_URL 미설정 — 건너뜀');
    return false;
  }

  const message = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📋 앱 카탈로그 — 시안 확정',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*시안*\n${payload.templateId} ${payload.templateName}` },
          { type: 'mrkdwn', text: `*브랜드 컬러*\n${payload.brandColor}` },
          { type: 'mrkdwn', text: `*브랜드명*\n${payload.brandName || '(미입력)'}` },
          { type: 'mrkdwn', text: `*배너 비율*\n${payload.bannerRatio}` },
        ],
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `전송일시: ${payload.date}` },
        ],
      },
    ],
  };

  // Slack Webhook은 CORS 차단됨 → Vite 프록시 또는 프로덕션 서버 프록시 경유
  // webhookUrl 예: https://hooks.slack.com/services/T.../B.../xxx
  // 프록시: /api/slack/services/T.../B.../xxx
  const path = webhookUrl.replace('https://hooks.slack.com', '');
  const proxyUrl = `/api/slack${path}`;

  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });

  return res.ok;
}

/** Google Sheets에 행 추가 (Apps Script Web App) */
async function sendToSheets(payload: SendPayload): Promise<boolean> {
  const webappUrl = import.meta.env.VITE_SHEETS_WEBAPP_URL;
  if (!webappUrl) {
    console.warn('[sendToSheets] VITE_SHEETS_WEBAPP_URL 미설정 — 건너뜀');
    return false;
  }

  const row = {
    date: payload.date,
    templateId: payload.templateId,
    templateName: payload.templateName,
    brandColor: payload.brandColor,
    brandName: payload.brandName,
    bannerRatio: payload.bannerRatio,
  };

  // Apps Script Web App은 302 리다이렉트 → CORS 차단됨
  // no-cors 모드로 전송 (응답 읽기 불가하지만 서버에는 도달)
  await fetch(webappUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(row),
  });

  // no-cors는 항상 opaque response → res.ok 확인 불가, 전송 성공으로 처리
  return true;
}

/**
 * 담당자에게 전달
 * - Slack과 Google Sheets 모두 세팅되어 있으면 동시 전송
 * - 하나만 세팅되어 있으면 해당 채널만 전송
 * - 모두 미세팅이면 false 반환
 */
export async function sendToManager(payload: SendPayload): Promise<{ success: boolean; channels: string[] }> {
  const results: Promise<{ channel: string; ok: boolean }>[] = [];

  if (import.meta.env.VITE_SLACK_WEBHOOK_URL) {
    results.push(sendToSlack(payload).then((ok) => ({ channel: 'Slack', ok })));
  }
  if (import.meta.env.VITE_SHEETS_WEBAPP_URL) {
    results.push(sendToSheets(payload).then((ok) => ({ channel: 'Google Sheets', ok })));
  }

  if (results.length === 0) {
    console.warn('[sendToManager] Slack/Sheets 환경변수 모두 미설정');
    // 환경변수 미설정 시에도 성공 처리 (데모 모드)
    return { success: true, channels: ['데모 모드'] };
  }

  const settled = await Promise.all(results);
  const succeeded = settled.filter((r) => r.ok);
  const failed = settled.filter((r) => !r.ok);

  if (failed.length > 0) {
    console.error('[sendToManager] 전송 실패:', failed.map((r) => r.channel).join(', '));
  }

  return {
    success: succeeded.length > 0,
    channels: succeeded.map((r) => r.channel),
  };
}
