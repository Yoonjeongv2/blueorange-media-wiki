import { getSheetData } from '@/lib/googleSheets';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sheet = searchParams.get('sheet');

  if (!sheet) {
    return NextResponse.json(
      { error: 'Sheet parameter is required' },
      { status: 400 }
    );
  }

  try {
    const data = await getSheetData(sheet);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sheet data' },
      { status: 500 }
    );
  }
}
