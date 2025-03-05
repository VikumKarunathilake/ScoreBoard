import { create } from 'zustand';
import type { House, Event } from './types';

interface AppState {
  houses: House[];
  events: Event[];
  isAdmin: boolean;
  setHouses: (houses: House[]) => void;
  setEvents: (events: Event[]) => void;
  setIsAdmin: (isAdmin: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  houses: [],
  events: [],
  isAdmin: false,
  setHouses: (houses) => set({ houses }),
  setEvents: (events) => set({ events }),
  setIsAdmin: (isAdmin) => set({ isAdmin }),
}));