// components/Home/Home.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Scores } from '@/types';
import { Header } from '@/components/Home/Header';
import { Scoreboard } from '@/components/Home/Scoreboard';
import { AdminControls } from '@/components/Home/AdminControls';
import { LoadingSpinner } from '@/components/Home/LoadingSpinner';
import { Footer } from '@/components/Home/Footer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function Home() {
    const { data: session, status } = useSession();
    const [scores, setScores] = useState<Scores>({
        red: 0,
        blue: 0,
        green: 0,
        yellow: 0,
    });
    const [lastUpdate, setLastUpdate] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const eventSourceRef = useRef<EventSource | null>(null);

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

    const initializeSSE = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        const es = new EventSource('/api/events');
        eventSourceRef.current = es;

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
                        const updateMessage = `${update.house} +${update.points} - ${update.event} (by ${update.updatedBy})`;
                        setLastUpdate(updateMessage);
                        toast.success('Score Updated', {
                            description: updateMessage,
                        });
                        break;

                    case 'score-reset':
                        setScores(data.data.scores);
                        const resetMessage = `Scores reset by ${data.data.updatedBy}`;
                        setLastUpdate(resetMessage);
                        toast.info('Scores Reset', {
                            description: resetMessage,
                        });
                        break;
                }
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        es.onerror = (error) => {
            console.error('SSE error:', error);
            es.close();

            setTimeout(() => {
                initializeSSE();
            }, 3000);
        };

        return es;
    }, []);

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
                toast.error('Unauthorized', {
                    description: 'Please sign in as admin to add points.',
                });
                setIsAdmin(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to add points');
            }

            toast.success('Points Added', {
                description: `Added ${points} points to ${house} for ${event}`,
            });
        } catch (error) {
            console.error('Error adding points:', error);
            toast.error('Error', {
                description: 'Failed to add points. Please check your admin permissions.',
            });
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
                toast.error('Unauthorized', {
                    description: 'Please sign in as admin to reset scores.',
                });
                setIsAdmin(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to reset scores');
            }

            toast.success('Scores Reset', {
                description: 'All scores have been reset to zero.',
            });
        } catch (error) {
            console.error('Error resetting scores:', error);
            toast.error('Error', {
                description: 'Failed to reset scores. Please check your admin permissions.',
            });
        }
    };

    if (isLoading || status === 'loading') {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-background p-4 flex flex-col">
            <div className="max-w-7xl mx-auto flex-1 w-full">
                <Header
                    session={session}
                    isAdmin={isAdmin}
                    onSignIn={() => signIn('google')}
                    onSignOut={() => signOut()}
                />

                {lastUpdate && (
                    <Alert className="mb-6 bg-blue-50 border-blue-200">
                        <AlertDescription className="text-blue-800">
                            Last update: {lastUpdate}
                        </AlertDescription>
                    </Alert>
                )}

                <Scoreboard scores={scores} />

                {session && isAdmin && (
                    <AdminControls
                        showAdminControls={false}
                        onToggleControls={() => { }}
                        onAddPoints={addPoints}
                        onResetScores={resetScores}
                    />
                )}
            </div>

            <div className="max-w-7xl mx-auto w-full">
                <Footer />
            </div>
        </div>
    );
}