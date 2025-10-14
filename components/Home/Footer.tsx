// components/Home/Footer.tsx
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from "@/components/ui/separator"
import { Heart, Github, ExternalLink } from 'lucide-react';

export function Footer() {
    return (
        <footer className="mt-12 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                <div className="text-sm">
                    <p className="font-medium">Live Sports Meet Scoreboard</p>
                    <p className="text-xs mt-1">Real-time updates powered by Next.js and SSE</p>
                </div>

                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                            <span className="text-xs">Develop by</span>
                            <Heart className="w-4 h-4 mr-2 text-red-500 fill-current" />
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 border-slate-200 shadow-lg">
                        <div className="flex justify-between space-x-4">
                            <Avatar>
                                <AvatarImage src="https://avatars.githubusercontent.com/u/112757882" />
                                <AvatarFallback>
                                    VK
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-slate-800">
                                    <a
                                        href="https://github.com/VikumKarunathilake/"
                                        className="hover:underline flex items-center gap-1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Vikum Karunathilake
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                                    <span>Built with modern tech</span>
                                    <Separator orientation="vertical" className="h-3" />
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Next.js</span>
                                        <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-xs">Tailwind</span>
                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Shadcn</span>
                                    </div>
                                </div>
                                <a href="https://github.com/VikumKarunathilake/ScoreBoard" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="mt-2 border-slate-500 text-xs">
                                        <Github className="w-3 h-3 mr-2" />
                                        View Source
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            </div>
        </footer>
    );
}