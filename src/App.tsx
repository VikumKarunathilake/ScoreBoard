import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { useStore } from './store';
import { wsClient } from './websocket';
import { AdminLogin } from './components/AdminLogin';
import { ScoreBoard } from './components/ScoreBoard';
import { EventSchedule } from './components/EventSchedule';
import { AdminPanel } from './components/AdminPanel';
import { Trophy } from 'lucide-react';

function App() {
  const { isAdmin } = useStore();

  useEffect(() => {
    wsClient.connect();
  }, []);

  if (!isAdmin) {
    return (
      <>
        <AdminLogin />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">House Scoring System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Admin Mode</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ScoreBoard />
            <EventSchedule />
          </div>
          <div>
            <AdminPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;