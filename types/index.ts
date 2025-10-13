interface Scores {
  red: number;
  blue: number;
  green: number;
  yellow: number;
  purple: number;
}

interface ScoreUpdate {
  scores: Scores;
  update: {
    house: keyof Scores;
    points: number;
    event: string;
    timestamp: string;
    updatedBy: string;
  };
}