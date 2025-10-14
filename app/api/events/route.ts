// app/api/events/route.ts
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readScores, addPoints, resetScores } from '@/lib/scoreStorage';
import { Scores } from '@/types';

// Store active connections
const clients: { id: number; controller: ReadableStreamDefaultController }[] = [];
let clientId = 0;

// Helper function to check if user is admin
function isAdmin(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
  return adminEmails.includes(email);
}

// Broadcast to all connected clients
function broadcast(data: object) {
  clients.forEach(client => {
    try {
      client.controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error('Error broadcasting to client:', error);
    }
  });
}

// Update scores and broadcast
export async function updateScoresAndBroadcast(house: keyof Scores, points: number, event: string, updatedBy: string) {
  const updatedScores = addPoints(house, points);
  
  broadcast({
    type: 'score-update',
    data: {
      scores: updatedScores,
      update: {
        house,
        points,
        event,
        timestamp: new Date().toISOString(),
        updatedBy
      }
    }
  });
  
  return updatedScores;
}

// Reset scores and broadcast
export async function resetScoresAndBroadcast(updatedBy: string) {
  const updatedScores = resetScores();
  
  broadcast({
    type: 'score-reset',
    data: {
      scores: updatedScores,
      updatedBy,
      timestamp: new Date().toISOString()
    }
  });
  
  return updatedScores;
}

export async function GET(request: NextRequest) {
  
  const stream = new ReadableStream({
    start(controller) {
      const id = clientId++;
      clients.push({ id, controller });

      // Send initial scores
      const initialScores = readScores();
      controller.enqueue(`data: ${JSON.stringify({
        type: 'initial',
        data: { scores: initialScores }
      })}\n\n`);

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        const index = clients.findIndex(client => client.id === id);
        if (index !== -1) {
          clients.splice(index, 1);
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    const { house, points, event } = body;

    if (house && points !== undefined && event) {
      const validHouses = ['red', 'blue', 'green', 'yellow',];
      if (!validHouses.includes(house)) {
        return new Response(JSON.stringify({ error: 'Invalid house' }), { status: 400 });
      }

      if (!Number.isInteger(points) || points < 0) {
        return new Response(JSON.stringify({ error: 'Points must be a positive integer' }), { status: 400 });
      }

      await updateScoresAndBroadcast(
        house as keyof Scores, 
        points, 
        event, 
        session.user.name || session.user.email
      );

      return new Response(JSON.stringify({ success: true }));
    }

    return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/events:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}

export async function PUT() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    await resetScoresAndBroadcast(session.user.name || session.user.email);

    return new Response(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Error in PUT /api/events:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}