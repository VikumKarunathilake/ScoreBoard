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
                        const updateMessage = `${update.house} +${update.points} - ${update.event}`;
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 flex flex-col">
            <div className="max-w-7xl mx-auto flex-1 w-full">
                <Header
                    session={session}
                    isAdmin={isAdmin}
                    onSignIn={() => signIn('google')}
                    onSignOut={() => signOut()}
                />

                {lastUpdate && (
                    <Alert className="mb-6 bg-blue-500/10 border-blue-200 backdrop-blur-sm">
                        <AlertDescription className="text-blue-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            Last update: {lastUpdate}
                        </AlertDescription>
                    </Alert>
                )}

                {session && isAdmin && (
                    <AdminControls
                        onAddPoints={addPoints}
                        onResetScores={resetScores}
                    />
                )}
                
                <Scoreboard scores={scores} />
            </div>

            <div className="max-w-7xl mx-auto w-full">
                <Footer />
            </div>
        </div>
    );
}