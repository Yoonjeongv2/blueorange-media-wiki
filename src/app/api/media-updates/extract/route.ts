import { NextRequest, NextResponse } from 'next/server';
import { draftFromInputs, fetchImageAsBase64, friendlyGeminiError } from '@/lib/gemini';

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
    return NextResponse.json({
      ...result,
      // 이미지를 URL에서 성공적으로 가져왔다면 그 base64를 그대로 돌려줘서,
      // 저장 시 같은 URL을 다시 가져오다 실패하는 일이 없도록 재사용하게 합니다.
      resolvedImageBase64: image?.base64 || '',
      resolvedImageMediaType: image?.mimeType || '',
    });
  } catch (error) {
    console.error('Extract API error:', error);
    return NextResponse.json({ error: friendlyGeminiError(error) }, { status: 500 });
  }
}
