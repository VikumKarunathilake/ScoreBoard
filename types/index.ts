export interface Scores {
  red: number;
  blue: number;
  green: number;
  yellow: number;
}

export interface ScoreUpdate {
  scores: Scores;
  update: {
    house: string;
    points: number;
    event: string;
    timestamp: string;
    updatedBy: string;
  };
}

// SSE Event Types
export interface SSEEvent {
  type: 'initial' | 'score-update' | 'score-reset';
  data: any;
}

export interface InitialEventData {
  scores: Scores;
}

export interface ScoreUpdateEventData {
  scores: Scores;
  update: {
    house: string;
    points: number;
    event: string;
    timestamp: string;
    updatedBy: string;
  };
}

export interface ScoreResetEventData {
  scores: Scores;
  updatedBy: string;
  timestamp: string;
}