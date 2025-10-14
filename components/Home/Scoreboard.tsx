// components/Home/Scoreboard.tsx
import { Scores } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { ScoreChart } from './ScoreChart';

interface ScoreboardProps {
    scores: Scores;
}

const houseColors: Record<keyof Scores, string> = {
    red: 'bg-red-500 border-red-700 text-primary-foreground',
    blue: 'bg-blue-500 border-blue-700 text-primary-foreground',
    green: 'bg-green-500 border-green-700 text-primary-foreground',
    yellow: 'bg-yellow-500 border-yellow-700 text-primary-foreground',
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
    const getPositionText = (pos: number) => {
        switch (pos) {
            case 0: return '🏆 1st';
            case 1: return '🥈 2nd';
            case 2: return '🥉 3rd';
            default: return `${pos + 1}th`;
        }
    };

    return (
        <Card className={`${houseColors[house]} border-2 transform transition-transform hover:scale-105`}>
            <CardContent className="p-6 text-center">
                <div className="text-xl font-bold mb-2">
                    {houseNames[house]}
                </div>
                <div className="text-5xl font-bold mb-4">{score}</div>
                <div className="text-lg font-medium">
                    {getPositionText(position)}
                </div>
            </CardContent>
        </Card>
    );
}