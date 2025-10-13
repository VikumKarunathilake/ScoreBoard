// app/api/push/route.ts - Keep only for initial admin check and backward compatibility
import { NextResponse } from 'next/server';
import { readScores } from '@/lib/scoreStorage';

export async function GET() {
  try {
    const currentScores = readScores();
    return NextResponse.json({ scores: currentScores });
  } catch (error) {
    console.error('Error in GET /api/push:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Remove POST and PUT methods since they're now handled by /api/events