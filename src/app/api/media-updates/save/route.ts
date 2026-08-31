import { NextRequest, NextResponse } from 'next/server';
import { appendSheetRow } from '@/lib/googleSheets';
import { uploadImageToBlob } from '@/lib/blobStorage';
import type { MediaUpdateDraft } from '@/lib/gemini';

// 시트의 편집(사본) 탭 이름은 완성되면 바뀔 수 있어 환경변수로 뺐습니다.
const SHEET_NAME = process.env.MEDIA_UPDATE_SHEET_NAME || 'update의 사본';

const HEADER_ALIASES: Record<string, string[]> = {
  게시물ID: ['게시물 ID'],
  참고URL: ['참고 URL'],
  AI정리요청: ['AI 정리 요청'],
  처리상태: ['처리 상태'],
  매체명: [],
  광고상품유형: ['광고 상품 유형'],
  제목: [],
  업데이트유형: ['업데이트 유형'],
  중요도: [],
  공지일: [],
  적용일: [],
  핵심요약: ['핵심 요약'],
  적용대상: ['적용 대상'],
  주요변경사항: ['주요 변경사항'],
  실무체크사항: ['실무 체크사항'],
  유의사항: [],
  검색키워드: ['검색 키워드'],
  대표이미지URL: ['대표 이미지 URL'],
  게시승인: ['게시 승인'],
  공개범위: ['공개 범위'],
  외부용제목: ['외부용 제목'],
  외부용요약: ['외부용 요약'],
  공개시작일: ['공개 시작일'],
  공개종료일: ['공개 종료일'],
  최종확인일: ['최종 확인일'],
  오류확인사항: ['오류·확인사항', '오류 확인사항'],
};

function generatePostId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `UPD-${date}-${suffix}`;
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  if (!process.env.ADMIN_API_SECRET || secret !== process.env.ADMIN_API_SECRET) {
    return NextResponse.json({ error: '인증에 실패했습니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const draft = body.draft as MediaUpdateDraft;
    const { sourceUrl, visibility, publishStart, publishEnd, imageBase64, imageMediaType } = body;

    if (!draft?.platform?.trim() || !draft?.title?.trim() || !draft?.summary?.trim()) {
      return NextResponse.json({ error: '매체명, 제목, 핵심 요약은 필수입니다.' }, { status: 400 });
    }

    let imageUrl = '';
    if (imageBase64 && imageMediaType) {
      try {
        imageUrl = await uploadImageToBlob(
          imageBase64,
          imageMediaType,
          `${draft.title || 'media-update'}-${Date.now()}`
        );
      } catch (imageError) {
        // 이미지 업로드 실패는 게시물 저장 자체를 막지 않고, 이미지 URL만 비워둡니다.
        console.error('Image upload error:', imageError);
      }
    }

    const row = await appendSheetRow(
      SHEET_NAME,
      {
        게시물ID: generatePostId(),
        참고URL: sourceUrl || '',
        AI정리요청: '',
        처리상태: '작성 완료',
        매체명: draft.platform,
        광고상품유형: draft.productType,
        제목: draft.title,
        업데이트유형: draft.updateType,
        중요도: draft.importance,
        공지일: draft.noticeDate,
        적용일: draft.effectiveDate,
        핵심요약: draft.summary,
        적용대상: draft.targetAudience,
        주요변경사항: draft.keyChanges,
        실무체크사항: draft.actionItems,
        유의사항: draft.cautions,
        검색키워드: draft.keywords,
        대표이미지URL: imageUrl,
        게시승인: '', // 검토자가 시트에서 직접 승인해야 공개됩니다.
        공개범위: visibility === '내부용' ? '내부용' : '외부 공개',
        외부용제목: draft.externalTitle,
        외부용요약: draft.externalSummary,
        공개시작일: publishStart || '',
        공개종료일: publishEnd || '',
        최종확인일: '',
        오류확인사항: '',
      },
      HEADER_ALIASES
    );

    return NextResponse.json({ success: true, row });
  } catch (error) {
    console.error('Save API error:', error);
    const message = error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
