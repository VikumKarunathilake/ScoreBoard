import { WebSocketMessage } from './types';
import { useStore } from './store';
import toast from 'react-hot-toast';

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;

  constructor() {
    this.url = `ws://47.128.244.161:3001`;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      const store = useStore.getState();

      switch (message.type) {
        case 'INIT': {
          const houses = Object.entries(message.data.scores).map(([name, score]) => ({
            name,
            score: score as number,
          }));
          const events = message.data.events.map((event: string) => {
            const [name, time] = event.split(' - ');
            return { name, time };
          });
          store.setHouses(houses);
          store.setEvents(events);
          break;
        }
      
        case 'UPDATE_SCORES': {
          const updatedHouses = Object.entries(message.data).map(([name, score]) => ({
            name,
            score: score as number,
          }));
          store.setHouses(updatedHouses);
          break;
        }
      
        case 'UPDATE_EVENTS': {
          const updatedEvents = message.data.map((event: string) => {
            const [name, time] = event.split(' - ');
            return { name, time };
          });
          store.setEvents(updatedEvents);
          break;
        }
      
        case 'AUTH_SUCCESS': {
          store.setIsAdmin(true);
          toast.success('Successfully logged in as admin');
          break;
        }
      
        case 'AUTH_FAIL': {
          toast.error(message.message || 'Authentication failed');
          break;
        }
      
        case 'ERROR': {
          toast.error(message.message || 'An error occurred');
          break;
        }
      }
    };

    if (this.ws) {
      this.ws.onclose = () => {
        toast.error('Connection lost. Reconnecting...');
        setTimeout(() => this.connect(), 1000);
      };

      this.ws.onerror = () => {
        toast.error('WebSocket error occurred');
      };
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN && this.ws) {
      this.ws.send(JSON.stringify(message));
    }
  }
}

export const wsClient = new WebSocketClient();
