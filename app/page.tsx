'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Scores } from '@/types';
import { Header } from '@/components/Home/Header';
import { Scoreboard } from '@/components/Home/Scoreboard';
import { AdminControls } from '@/components/Home/AdminControls';
import { LoadingSpinner } from '@/components/Home/LoadingSpinner';

export default function Home() {
  const { data: session, status } = useSession();
  const [scores, setScores] = useState<Scores>({
    red: 0,
    blue: 0,
    green: 0,
    yellow: 0,
    purple: 0
  });
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // Check admin status
  useEffect(() => {
    if (session?.user?.email) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [session]);

  const checkAdminStatus = async () => {
    try {
      await fetch('/api/events');
      setIsAdmin(true);
    } catch {
      setIsAdmin(false);
    }
  };

  // Initialize SSE connection
  const initializeSSE = useCallback(() => {
    if (eventSource) {
      eventSource.close();
    }

    const es = new EventSource('/api/events');
    
    es.onopen = () => {
      console.log('SSE connection opened');
      setIsLoading(false);
    };

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'initial':
            setScores(data.data.scores);
            break;
          
          case 'score-update':
            setScores(data.data.scores);
            const update = data.data.update;
            setLastUpdate(`${update.house} +${update.points} - ${update.event} (by ${update.updatedBy})`);
            break;
          
          case 'score-reset':
            setScores(data.data.scores);
            setLastUpdate(`Scores reset by ${data.data.updatedBy}`);
            break;
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    es.onerror = (error) => {
      console.error('SSE error:', error);
      es.close();
      
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        initializeSSE();
      }, 3000);
    };

    setEventSource(es);

    return es;
  }, [eventSource]);

  // Set up SSE connection
  useEffect(() => {
    const es = initializeSSE();

    return () => {
      if (es) {
        es.close();
      }
    };
  }, [initializeSSE]);



  const addPoints = async (house: keyof Scores, points: number, event: string) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ house, points, event }),
      });

      if (response.status === 401) {
        alert('Unauthorized: Please sign in as admin');
        setShowAdminControls(false);
        setIsAdmin(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to add points');
      }
    } catch (error) {
      console.error('Error adding points:', error);
      alert('Error adding points. Please check your admin permissions.');
      setShowAdminControls(false);
    }
  };

  const resetScores = async () => {
    try {
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        alert('Unauthorized: Please sign in as admin');
        setShowAdminControls(false);
        setIsAdmin(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to reset scores');
      }
    } catch (error) {
      console.error('Error resetting scores:', error);
      alert('Error resetting scores. Please check your admin permissions.');
      setShowAdminControls(false);
    }
  };

  if (isLoading || status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <Header 
          session={session}
          isAdmin={isAdmin}
          onSignIn={() => signIn('google')}
          onSignOut={() => signOut()}
        />

        {lastUpdate && (
          <div className="mb-6 p-3 bg-blue-100 text-blue-800 rounded text-center">
            Last update: {lastUpdate}
          </div>
        )}

        <Scoreboard scores={scores} />

        {session && isAdmin && (
          <AdminControls
            showAdminControls={showAdminControls}
            onToggleControls={() => setShowAdminControls(!showAdminControls)}
            onAddPoints={addPoints}
            onResetScores={resetScores}
          />
        )}
      </div>
    </div>
  );
}