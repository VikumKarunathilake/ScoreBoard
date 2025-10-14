// components/Home/Footer.tsx
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Separator } from "@/components/ui/separator"

export function Footer() {
    return (
        <footer className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div className="text-sm text-muted-foreground">
                    <p>Live Sports Meet Scoreboard</p>
                    <p className="text-xs mt-1">Real-time updates powered by Next.js and SSE</p>
                </div>

                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <span className="text-xs">Developed with ❤️</span>
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                            <Avatar>
                                <AvatarImage src="https://avatars.githubusercontent.com/u/112757882" />
                            </Avatar>
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold">
                                    <a href="https://github.com/VikumKarunathilake/" className="hover:underline" target="_blank" rel="noopener noreferrer">Vikum Karunathilake</a>
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-muted-foreground">
                                    <span>Built with</span>
                                    <Separator orientation="horizontal" className="h-4" />
                                    <span>Next.js</span>    
                                    <Separator orientation="vertical" className="h-4" />
                                    <span>Tailwind CSS</span>
                                    <Separator orientation="vertical" className="h-4" />
                                    <span>Shadcn</span>
                                </div>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </div>
        </footer>
    );
}
