// components/Home/Scoreboard.tsx
import { Scores } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ScoreChart } from './ScoreChart';

interface ScoreboardProps {
    scores: Scores;
}

const houseColors: Record<keyof Scores, { bg: string; border: string; gradient: string }> = {
    red: {
        bg: 'bg-red-500',
        border: 'border-red-600',
        gradient: 'from-red-500 to-red-600'
    },
    blue: {
        bg: 'bg-blue-500',
        border: 'border-blue-600',
        gradient: 'from-blue-500 to-blue-600'
    },
    green: {
        bg: 'bg-green-500',
        border: 'border-green-600',
        gradient: 'from-green-500 to-green-600'
    },
    yellow: {
        bg: 'bg-yellow-500',
        border: 'border-yellow-600',
        gradient: 'from-yellow-500 to-yellow-600'
    },
};

const houseNames: Record<keyof Scores, string> = {
    red: 'Pius',
    blue: 'Bede',
    green: 'Austin',
    yellow: 'Clement',
};

export function Scoreboard({ scores }: ScoreboardProps) {
    const sortedHouses = Object.entries(scores).sort(([, a], [, b]) => (b as number) - (a as number));

    return (
        <div className="space-y-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedHouses.map(([house, score], index) => (
                    <ScoreCard
                        key={house}
                        house={house as keyof Scores}
                        score={score}
                        position={index}
                    />
                ))}
            </div>

            <ScoreChart scores={scores} />
        </div>
    );
}

interface ScoreCardProps {
    house: keyof Scores;
    score: number;
    position: number;
}

function ScoreCard({ house, score, position }: ScoreCardProps) {
    const getPositionStyle = (pos: number) => {
        switch (pos) {
            case 0: return {
                text: '🏆 1st Place',
                bg: 'bg-gradient-to-br from-yellow-400 to-orange-500',
                shadow: 'shadow-lg'
            };
            case 1: return {
                text: '🥈 2nd Place',
                bg: 'bg-gradient-to-br from-gray-400 to-gray-500',
                shadow: 'shadow-lg'
            };
            case 2: return {
                text: '🥉 3rd Place',
                bg: 'bg-gradient-to-br from-amber-600 to-amber-700',
                shadow: 'shadow-lg'
            };
            default: return {
                text: `${pos + 1}th Place`,
                bg: 'bg-gradient-to-br from-slate-500 to-slate-600',
                shadow: 'shadow-lg'
            };
        }
    };

    const positionStyle = getPositionStyle(position);

    return (
        <Card className={`border-0 transform transition-all duration-300 hover:scale-105 text-slate-900 hover:shadow-xl bg-gradient-to-r ${houseColors[house].gradient} ${positionStyle.shadow}`}>
            <CardContent className="p-6 text-center relative overflow-hidden">
                <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${positionStyle.bg}`}>
                        {positionStyle.text}
                    </div>
                </div>

                <div className="mb-4">
                    <div className="text-lg font-semibold opacity-90 mb-1">House</div>
                    <div className="text-2xl font-bold">{houseNames[house]}</div>
                </div>

                <div className="text-6xl font-bold mb-2 drop-shadow-lg">{score}</div>
                <div className="text-sm opacity-80">Total Points</div>
            </CardContent>
        </Card>
    );
}