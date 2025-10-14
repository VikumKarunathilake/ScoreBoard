// components/Home/LoadingSpinner.tsx
import { Card, CardContent } from '@/components/ui/card';

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl  /80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
          <div className="text-xl font-semibold text-slate-800 mb-2">Loading Scoreboard</div>
          <div className="text-sm text-slate-600">Connecting to live updates...</div>
        </CardContent>
      </Card>
    </div>
  );
}