// components/Home/Header.tsx
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
    session: Session | null;
    isAdmin: boolean;
    onSignIn: () => void;
    onSignOut: () => void;
}

export function Header({ session, isAdmin, onSignIn, onSignOut }: HeaderProps) {
    return (
        <Card className="mb-8">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                            Live Sports Meet Scoreboard
                        </h1>
                        <p className="text-muted-foreground">Real-time updates from the sports meet</p>
                    </div>

                    <div className="text-center md:text-right">
                        {session ? (
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={session.user?.image || ''} />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                            {session.user?.name?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm text-muted-foreground">
                                        <div className="font-medium text-foreground">{session.user?.name}</div>
                                        <div className="text-xs">{session.user?.email}</div>
                                        {isAdmin && (
                                            <div className="text-green-600 font-semibold text-xs">Admin</div>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    onClick={onSignOut}
                                    variant="destructive"
                                    size="sm"
                                >
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={onSignIn}
                                variant="default"
                                className="flex items-center gap-2"
                            >
                                <GoogleIcon />
                                Sign in with Google
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function GoogleIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}