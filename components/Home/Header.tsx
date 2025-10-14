// components/Home/Header.tsx
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
    session: Session | null;
    isAdmin: boolean;
    onSignIn: () => void;
    onSignOut: () => void;
}

export function Header({ session, isAdmin, onSignIn, onSignOut }: HeaderProps) {
    return (
        <Card className="mb-8 border-0 shadow-lg backdrop-blur-sm">
            <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text">
                                Sports Meet Live
                            </h1>
                        </div>
                        <p>Real-time score tracking and analytics</p>
                    </div>

                    <div className="text-center md:text-right">
                        {session ? (
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 shadow-md">
                                        <AvatarImage src={session.user?.image || ''} />
                                    </Avatar>
                                    <div className="text-sm">
                                        <div className="font-semibold text-slate-800">{session.user?.name}</div>
                                        <div className="text-slate-500 text-xs">{session.user?.email}</div>
                                        {isAdmin && (
                                            <Badge variant="default" className="mt-1 bg-green-500 hover:bg-green-600">
                                                Admin
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={onSignOut}
                                    variant="outline"
                                    size="sm"
                                    className="border-slate-300 text-slate-700 hover:bg-destructive"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={onSignIn}
                                className="bg-white text-black border shadow-sm flex items-center gap-3"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
