import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// 무료 티어로 계속 쓸 수 있도록 이미지 생성 모델이 아닌 텍스트/멀티모달 이해용 Flash 모델을 씁니다.
// 'gemini-flash-latest' 별칭은 테스트 중 503(과부하)이 잦아, 실제 동작이 확인된 버전을 고정해서 씁니다.
// 추후 구버전이 되면 콘솔 안내에 따라 최신 Flash 모델명으로 교체하면 됩니다.
const MODEL = 'gemini-3.6-flash';

export interface MediaUpdateDraft {
  platform: string;
  productType: string;
  title: string;
  updateType: string;
  importance: string;
  noticeDate: string;
  effectiveDate: string;
  summary: string;
  targetAudience: string;
  keyChanges: string;
  actionItems: string;
  cautions: string;
  keywords: string;
  externalTitle: string;
  externalSummary: string;
}

const JSON_SHAPE = `{
  "platform": "매체명 (예: NAVER SA, KAKAO, Meta, Google Ads, 토스)",
  "productType": "광고 상품/기능 이름",
  "title": "내부 참고용 상세 제목",
  "updateType": "신규 상품 | 시스템 업데이트 | 정책 변경 | 기타 중 하나",
  "importance": "중요 | 참고 | 확인 필요 중 하나",
  "noticeDate": "공지일 (YYYY-MM-DD, 모르면 오늘 날짜)",
  "effectiveDate": "적용일 (YYYY-MM-DD, 모르면 빈 문자열)",
  "summary": "핵심 내용을 3~5문장으로 요약",
  "targetAudience": "적용 대상을 줄바꿈으로 구분된 항목으로 정리 (모르면 빈 문자열)",
  "keyChanges": "주요 변경사항을 '카테고리: 내용' 형식으로, 줄바꿈으로 구분해 정리. 카테고리는 고정된 목록이 아니라 이 공지 내용에 실제로 해당하는 것만 골라서 자유롭게 정하세요 (예시일 뿐이니 참고만: 노출 일정, 대상 지면, 대상 상품, 설정 방법, 타겟팅, 과금 방식, 보고서 확인 방법, 소재 형식 등). 공지에 없는 내용을 억지로 만들어 카테고리를 채우지 마세요.",
  "actionItems": "담당자가 실무에서 확인해야 할 체크사항을 줄바꿈으로 구분된 항목으로 정리",
  "cautions": "유의사항을 줄바꿈으로 구분된 항목으로 정리 (모르면 빈 문자열)",
  "keywords": "쉼표로 구분된 검색 키워드 3~6개",
  "externalTitle": "사내 위키 외부 공개용 간결한 제목 (30자 이내)",
  "externalSummary": "외부 공개용 요약 2~3문장"
}`;

function buildSystemPrompt(): string {
  const today = new Date().toISOString().slice(0, 10);
  return `당신은 광고 매체(네이버, 카카오, Meta, Google, 토스 등)의 업데이트 소식을 사내 위키용으로 정리하는 어시스턴트입니다.
오늘 날짜는 ${today}입니다. "오늘 날짜"가 필요한 항목은 반드시 이 날짜를 기준으로 판단하세요.
주어진 내용을 바탕으로 아래 JSON 형식으로만 답하세요. 다른 설명은 절대 추가하지 마세요. 알 수 없는 값은 빈 문자열로 두세요.
${JSON_SHAPE}
모든 텍스트 값은 한국어로 작성하세요.`;
}

function parseJsonResponse(text: string): MediaUpdateDraft {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error('AI 응답에서 JSON을 찾을 수 없습니다.');
  }
  const parsed = JSON.parse(match[0]);
  const field = (key: string) => String(parsed[key] ?? '').trim();
  return {
    platform: field('platform'),
    productType: field('productType'),
    title: field('title'),
    updateType: field('updateType'),
    importance: field('importance'),
    noticeDate: field('noticeDate'),
    effectiveDate: field('effectiveDate'),
    summary: field('summary'),
    targetAudience: field('targetAudience'),
    keyChanges: field('keyChanges'),
    actionItems: field('actionItems'),
    cautions: field('cautions'),
    keywords: field('keywords'),
    externalTitle: field('externalTitle'),
    externalSummary: field('externalSummary'),
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMeta(html: string, ...names: string[]): string {
  for (const name of names) {
    const og = html.match(
      new RegExp(`<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i')
    );
    if (og?.[1]) return og[1];
    const reversed = html.match(
      new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${name}["']`, 'i')
    );
    if (reversed?.[1]) return reversed[1];
  }
  return '';
}

async function fetchUrlAsText(url: string): Promise<{ title: string; description: string; body: string }> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BlueorangeMediaWikiBot/1.0)' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    throw new Error(`페이지를 가져오지 못했습니다 (HTTP ${res.status}).`);
  }
  const html = await res.text();
  const ogTitle = extractMeta(html, 'og:title', 'twitter:title');
  const titleTag = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '';
  const ogDescription = extractMeta(html, 'og:description', 'twitter:description', 'description');
  const body = stripHtml(html).slice(0, 6000);
  return { title: ogTitle || titleTag, description: ogDescription, body };
}

export async function fetchImageAsBase64(imageUrl: string): Promise<{ base64: string; mimeType: string }> {
  const res = await fetch(imageUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BlueorangeMediaWikiBot/1.0)' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    throw new Error(`이미지를 가져오지 못했습니다 (HTTP ${res.status}).`);
  }
  const mimeType = res.headers.get('content-type')?.split(';')[0] || 'image/jpeg';
  const buffer = await res.arrayBuffer();
  return { base64: Buffer.from(buffer).toString('base64'), mimeType };
}

export interface DraftInputs {
  platformHint: string;
  url?: string;
  text?: string;
  image?: { base64: string; mimeType: string };
}

export async function draftFromInputs(inputs: DraftInputs): Promise<MediaUpdateDraft> {
  const { platformHint, url, text, image } = inputs;
  if (!url?.trim() && !text?.trim() && !image) {
    throw new Error('URL, 텍스트, 이미지 중 하나 이상을 입력해주세요.');
  }

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
  if (image) {
    parts.push({ inlineData: { mimeType: image.mimeType, data: image.base64 } });
  }

  const sections = [`[매체 힌트]: ${platformHint || '(미지정)'}`];

  if (url?.trim()) {
    const page = await fetchUrlAsText(url.trim());
    sections.push(
      `[원문 URL]: ${url.trim()}`,
      `[페이지 제목]: ${page.title}`,
      `[메타 설명]: ${page.description}`,
      `[본문 발췌]: ${page.body}`
    );
  }

  if (text?.trim()) {
    sections.push(`[입력 텍스트]:\n${text.trim()}`);
  }

  if (image) {
    sections.push('[첨부 이미지]: 위 이미지(공지사항 캡처, 스크린샷 등)도 함께 참고하세요.');
  }

  sections.push('위 내용을 종합해 매체 업데이트 소식으로 정리해 JSON으로 답하세요.');
  parts.push({ text: sections.join('\n\n') });

  const response = await client.models.generateContent({
    model: MODEL,
    contents: [{ role: 'user', parts }],
    config: {
      systemInstruction: buildSystemPrompt(),
      responseMimeType: 'application/json',
    },
  });
  return parseJsonResponse(response.text || '');
}
