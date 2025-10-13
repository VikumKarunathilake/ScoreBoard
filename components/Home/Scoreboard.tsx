import { Scores } from '../../types';

interface ScoreboardProps {
    scores: Scores;
}

const houseColors: Record<keyof Scores, string> = {
    red: 'bg-red-500 border-red-700',
    blue: 'bg-blue-500 border-blue-700',
    green: 'bg-green-500 border-green-700',
    yellow: 'bg-yellow-500 border-yellow-700',
    purple: 'bg-purple-500 border-purple-700',
};

const houseNames: Record<keyof Scores, string> = {
    red: 'Red House',
    blue: 'Blue House',
    green: 'Green House',
    yellow: 'Yellow House',
    purple: 'Purple House',
};

export function Scoreboard({ scores }: ScoreboardProps) {
    // Sort houses by score (descending)
    const sortedHouses = Object.entries(scores).sort(([, a], [, b]) => (b as number) - (a as number));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {sortedHouses.map(([house, score], index) => (
                <ScoreCard
                    key={house}
                    house={house as keyof Scores}
                    score={score}
                    position={index}
                />
            ))}
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
        <div
            className={`${houseColors[house]} rounded-lg p-6 text-white shadow-lg transform transition-transform hover:scale-105`}
        >
            <div className="text-center">
                <div className="text-2xl font-bold mb-2">
                    {houseNames[house]}
                </div>
                <div className="text-5xl font-bold mb-4">{score}</div>
                <div className="text-lg">
                    {getPositionText(position)}
                </div>
            </div>
        </div>
    );
}