import { NextRequest, NextResponse } from 'next/server';
import { resummarize } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  if (!process.env.ADMIN_API_SECRET || secret !== process.env.ADMIN_API_SECRET) {
    return NextResponse.json({ error: '인증에 실패했습니다.' }, { status: 401 });
  }

  try {
    const { draft } = await request.json();
    if (!draft) {
      return NextResponse.json({ error: 'draft가 필요합니다.' }, { status: 400 });
    }
    const summary = await resummarize(draft);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Resummarize API error:', error);
    const message = error instanceof Error ? error.message : '요약을 다시 정리하는 중 오류가 발생했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
