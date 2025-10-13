// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { useSession, signIn, signOut } from 'next-auth/react';
// types are import form types/index.ts

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

  useEffect(() => {
    // Check if user is admin when session changes
    if (session?.user?.email) {
      checkAdminStatus(session.user.email);
    } else {
      setIsAdmin(false);
    }
  }, [session]);

  const checkAdminStatus = async (email: string) => {
    try {
      // Try to fetch scores - if successful, user has read access
      // For a more accurate check, you might want to create a dedicated admin check endpoint
      await fetch('/api/push');
      setIsAdmin(true);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe('sports-meet');

    channel.bind('score-update', (data: ScoreUpdate) => {
      setScores(data.scores);
      setLastUpdate(`${data.update.house} +${data.update.points} - ${data.update.event} (by ${data.update.updatedBy})`);
    });

    channel.bind('score-reset', (data: { scores: Scores; updatedBy: string }) => {
      setScores(data.scores);
      setLastUpdate(`Scores reset by ${data.updatedBy}`);
    });

    // Fetch initial scores
    fetchScores().finally(() => setIsLoading(false));

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const fetchScores = async () => {
    try {
      const response = await fetch('/api/push');
      const data = await response.json();
      if (data.scores) {
        setScores(data.scores);
      }
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const addPoints = async (house: keyof Scores, points: number, event: string) => {
    try {
      const response = await fetch('/api/push', {
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
      const response = await fetch('/api/push', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scores: { red: 0, blue: 0, green: 0, yellow: 0, purple: 0 } }),
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

  const houseColors = {
    red: 'bg-red-500 border-red-700',
    blue: 'bg-blue-500 border-blue-700',
    green: 'bg-green-500 border-green-700',
    yellow: 'bg-yellow-500 border-yellow-700',
    purple: 'bg-purple-500 border-purple-700',
  };

  const houseNames = {
    red: 'Red House',
    blue: 'Blue House',
    green: 'Green House',
    yellow: 'Yellow House',
    purple: 'Purple House',
  };

  // Sort houses by score (descending)
  const sortedHouses = Object.entries(scores).sort(([, a], [, b]) => b - a);

  // Show loading state
  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading Scoreboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Auth */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Live Sports Meet Scoreboard
            </h1>
            <p className="text-gray-600">Real-time updates from the sports meet</p>
          </div>

          <div className="text-right">
            {session ? (
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  <div>Hello, {session.user?.name}</div>
                  <div className="text-xs">{session.user?.email}</div>
                  {isAdmin && (
                    <div className="text-green-600 font-semibold">Admin</div>
                  )}
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>
            )}
          </div>
        </div>

        {lastUpdate && (
          <div className="mb-6 p-3 bg-blue-100 text-blue-800 rounded text-center">
            Last update: {lastUpdate}
          </div>
        )}

        {/* Scoreboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {sortedHouses.map(([house, score], index) => (
            <div
              key={house}
              className={`${houseColors[house as keyof Scores]} rounded-lg p-6 text-white shadow-lg transform transition-transform hover:scale-105`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">
                  {houseNames[house as keyof Scores]}
                </div>
                <div className="text-5xl font-bold mb-4">{score}</div>
                <div className="text-lg">
                  {index === 0 ? '🏆 1st' :
                    index === 1 ? '🥈 2nd' :
                      index === 2 ? '🥉 3rd' :
                        `${index + 1}th`}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Admin Controls - Only show for authenticated admins */}
        {session && isAdmin && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Admin Controls</h2>
              <button
                onClick={() => setShowAdminControls(!showAdminControls)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                {showAdminControls ? 'Hide Controls' : 'Show Controls'}
              </button>
            </div>

            {showAdminControls && (
              <div className="space-y-4">
                {/* Quick Add Points */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {Object.keys(scores).map((house) => (
                    <div key={house} className="text-center">
                      <div className="font-semibold mb-2 capitalize">{house}</div>
                      <div className="flex gap-1 justify-center">
                        {[1, 3, 5].map((points) => (
                          <button
                            key={points}
                            onClick={() => addPoints(house as keyof Scores, points, `Event ${points}pts`)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm"
                          >
                            +{points}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Custom Points */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Custom Points</h3>
                  <div className="flex gap-2 flex-wrap">
                    {Object.keys(scores).map((house) => (
                      <button
                        key={house}
                        onClick={() => {
                          const points = prompt(`Enter points for ${house}:`);
                          const event = prompt('Enter event name:');
                          if (points && event) {
                            addPoints(house as keyof Scores, parseInt(points), event);
                          }
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded capitalize"
                      >
                        Add to {house}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all scores?')) {
                        resetScores();
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reset All Scores
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}