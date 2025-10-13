import { Scores } from '../../types';

const houseNames: Record<keyof Scores, string> = {
    red: 'Red House',
    blue: 'Blue House',
    green: 'Green House',
    yellow: 'Yellow House',
    purple: 'Purple House',
};

interface AdminControlsProps {
    showAdminControls: boolean;
    onToggleControls: () => void;
    onAddPoints: (house: keyof Scores, points: number, event: string) => void;
    onResetScores: () => void;
}

export function AdminControls({
    showAdminControls,
    onToggleControls,
    onAddPoints,
    onResetScores,
}: AdminControlsProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Admin Controls</h2>
                <button
                    onClick={onToggleControls}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    {showAdminControls ? 'Hide Controls' : 'Show Controls'}
                </button>
            </div>

            {showAdminControls && (
                <div className="space-y-4">
                    <QuickAddPoints onAddPoints={onAddPoints} />
                    <CustomPoints onAddPoints={onAddPoints} />
                    <ResetButton onResetScores={onResetScores} />
                </div>
            )}
        </div>
    );
}

interface QuickAddPointsProps {
    onAddPoints: (house: keyof Scores, points: number, event: string) => void;
}

function QuickAddPoints({ onAddPoints }: QuickAddPointsProps) {
    return (
        <div>
            <h3 className="font-semibold mb-2">Quick Add Points</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.keys(houseNames).map((house) => (
                    <div key={house} className="text-center">
                        <div className="font-semibold mb-2 capitalize">{house}</div>
                        <div className="flex gap-1 justify-center">
                            {[1, 3, 5].map((points) => (
                                <button
                                    key={points}
                                    onClick={() => onAddPoints(house as keyof Scores, points, `Event ${points}pts`)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded text-sm"
                                >
                                    +{points}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface CustomPointsProps {
    onAddPoints: (house: keyof Scores, points: number, event: string) => void;
}

function CustomPoints({ onAddPoints }: CustomPointsProps) {
    return (
        <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Custom Points</h3>
            <div className="flex gap-2 flex-wrap">
                {Object.keys(houseNames).map((house) => (
                    <button
                        key={house}
                        onClick={() => {
                            const points = prompt(`Enter points for ${house}:`);
                            const event = prompt('Enter event name:');
                            if (points && event) {
                                onAddPoints(house as keyof Scores, parseInt(points), event);
                            }
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded capitalize"
                    >
                        Add to {house}
                    </button>
                ))}
            </div>
        </div>
    );
}

interface ResetButtonProps {
    onResetScores: () => void;
}

function ResetButton({ onResetScores }: ResetButtonProps) {
    return (
        <div className="border-t pt-4">
            <button
                onClick={() => {
                    if (confirm('Are you sure you want to reset all scores?')) {
                        onResetScores();
                    }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
                Reset All Scores
            </button>
        </div>
    );
}