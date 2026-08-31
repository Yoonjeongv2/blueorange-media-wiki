import { NextRequest, NextResponse } from 'next/server';
import { draftFromUrl, draftFromText, draftFromImage } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  if (!process.env.ADMIN_API_SECRET || secret !== process.env.ADMIN_API_SECRET) {
    return NextResponse.json({ error: '인증에 실패했습니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { mode, platform } = body;

    if (mode === 'url') {
      if (!body.url) {
        return NextResponse.json({ error: 'URL을 입력해주세요.' }, { status: 400 });
      }
      const result = await draftFromUrl(body.url, platform || '');
      return NextResponse.json(result);
    }

    if (mode === 'text') {
      if (!body.text?.trim()) {
        return NextResponse.json({ error: '텍스트를 입력해주세요.' }, { status: 400 });
      }
      const result = await draftFromText(body.text, platform || '');
      return NextResponse.json(result);
    }

    if (mode === 'image') {
      if (!body.imageBase64 || !body.imageMediaType) {
        return NextResponse.json({ error: '이미지를 첨부해주세요.' }, { status: 400 });
      }
      const result = await draftFromImage(body.imageBase64, body.imageMediaType, platform || '');
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: '알 수 없는 입력 방식입니다.' }, { status: 400 });
  } catch (error) {
    console.error('Extract API error:', error);
    const message = error instanceof Error ? error.message : '내용을 정리하는 중 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
