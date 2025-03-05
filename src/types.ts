export interface House {
  name: string;
  score: number;
}

export interface Event {
  name: string;
  time: string;
}

export interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

export interface ScoreUpdate {
  [houseName: string]: number;
}