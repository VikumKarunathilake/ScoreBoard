// app/api/push/route.ts
import Pusher from 'pusher';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Initial scores for 5 houses
const initialScores = {
  red: 0,
  blue: 0,
  green: 0,
  yellow: 0,
  purple: 0
};

let currentScores = { ...initialScores };

// Helper function to check if user is admin
function isAdmin(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
  return adminEmails.includes(email);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { house, points, event } = body;

    if (house && points !== undefined) {
      // Update scores
      currentScores[house as keyof typeof currentScores] += points;
      
      // Trigger Pusher event
      await pusher.trigger('sports-meet', 'score-update', {
        scores: currentScores,
        update: {
          house,
          points,
          event,
          timestamp: new Date().toISOString(),
          updatedBy: session.user.name || session.user.email
        }
      });

      return NextResponse.json({ 
        success: true, 
        scores: currentScores 
      });
    }

    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ scores: currentScores });
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scores } = body;

    if (scores) {
      currentScores = { ...scores };
      
      await pusher.trigger('sports-meet', 'score-reset', {
        scores: currentScores,
        timestamp: new Date().toISOString(),
        updatedBy: session.user.name || session.user.email
      });

      return NextResponse.json({ success: true, scores: currentScores });
    }

    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}