import { NextRequest, NextResponse } from 'next/server';
import { draftFromInputs, fetchImageAsBase64 } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  if (!process.env.ADMIN_API_SECRET || secret !== process.env.ADMIN_API_SECRET) {
    return NextResponse.json({ error: '인증에 실패했습니다.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { platform, url, text, imageBase64, imageMediaType, imageUrl } = body;

    let image: { base64: string; mimeType: string } | undefined;
    if (imageBase64 && imageMediaType) {
      image = { base64: imageBase64, mimeType: imageMediaType };
    } else if (imageUrl?.trim()) {
      image = await fetchImageAsBase64(imageUrl.trim());
    }

    const result = await draftFromInputs({ platformHint: platform || '', url, text, image });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Extract API error:', error);
    const message = error instanceof Error ? error.message : '내용을 정리하는 중 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
