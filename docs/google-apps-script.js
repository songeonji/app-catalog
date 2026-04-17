/**
 * Google Apps Script — 앱 카탈로그 담당자 전달용
 *
 * 설정 방법:
 * 1. Google Sheets에서 확장 프로그램 > Apps Script 열기
 * 2. 이 코드를 붙여넣기
 * 3. 배포 > 새 배포 > 웹 앱 선택
 *    - 실행 주체: 본인
 *    - 액세스: 모든 사용자
 * 4. 배포 URL을 .env의 VITE_SHEETS_WEBAPP_URL에 설정
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.date || new Date().toISOString().slice(0, 10),
      data.templateId || '',
      data.templateName || '',
      data.brandColor || '',
      data.brandName || '',
      data.bannerRatio || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 스프레드시트 헤더 초기 설정 (최초 1회 실행)
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.getRange(1, 1, 1, 6).setValues([
    ['날짜', '시안', '시안명', '브랜드 컬러', '브랜드명', '배너 비율']
  ]);
  sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
}
