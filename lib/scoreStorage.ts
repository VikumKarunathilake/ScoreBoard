// lib/scoreStorage.ts
import fs from 'fs';
import path from 'path';

const SCORES_FILE = path.join(process.cwd(), 'data', 'scores.json');

// Initial scores
const initialScores = {
  red: 0,
  blue: 0,
  green: 0,
  yellow: 0,
  purple: 0
};

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(SCORES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read scores from file
export function readScores(): typeof initialScores {
  try {
    ensureDataDirectory();
    if (fs.existsSync(SCORES_FILE)) {
      const data = fs.readFileSync(SCORES_FILE, 'utf8');
      const savedScores = JSON.parse(data);
      
      // Ensure all houses are present
      const scoresWithAllHouses = { ...initialScores, ...savedScores };
      return scoresWithAllHouses;
    }
  } catch (error) {
    console.error('Error reading scores:', error);
  }
  
  // Return initial scores if file doesn't exist or error
  writeScores(initialScores); // Create initial file
  return { ...initialScores };
}

// Write scores to file
export function writeScores(scores: typeof initialScores): void {
  try {
    ensureDataDirectory();
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
  } catch (error) {
    console.error('Error writing scores:', error);
  }
}

// Add points to a specific house
export function addPoints(house: keyof typeof initialScores, points: number): typeof initialScores {
  const currentScores = readScores();
  currentScores[house] += points;
  writeScores(currentScores);
  return currentScores;
}

// Reset all scores to zero
export function resetScores(): typeof initialScores {
  writeScores(initialScores);
  return { ...initialScores };
}