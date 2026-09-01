import { NextRequest, NextResponse } from 'next/server';
import { resummarize, friendlyGeminiError } from '@/lib/gemini';

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
    return NextResponse.json({ error: friendlyGeminiError(error) }, { status: 500 });
  }
}
