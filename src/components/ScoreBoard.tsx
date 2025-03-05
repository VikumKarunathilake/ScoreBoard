import { Trophy } from 'lucide-react';
import { useStore } from '../store';
import type { House } from '../types';

export function ScoreBoard() {
  const { houses } = useStore();
  
  const sortedHouses = [...houses].sort((a: House, b: House) => b.score - a.score);
  const maxScore = Math.max(...houses.map(h => h.score));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">House Scores</h2>
        <Trophy className="w-8 h-8 text-yellow-500" />
      </div>
      <div className="space-y-4">
        {sortedHouses.map((house, index) => (
          <div key={house.name} className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-700">{house.name}</span>
              <span className="font-bold text-gray-900">{house.score}</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  index === 0 ? 'bg-yellow-500' : 'bg-blue-500'
                }`}
                style={{ width: `${(house.score / maxScore) * 100}%` }}
              />
            </div>
            {index === 0 && (
              <div className="absolute -top-2 -right-2">
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}