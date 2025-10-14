// components/Home/LoadingSpinner.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from "@/components/ui/spinner"

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <Spinner className="size-16 mx-auto mb-4 text-blue-500" />
          <div className="text-xl text-foreground">Loading Scoreboard...</div>
          <div className="text-sm text-muted-foreground mt-2">Connecting to live updates</div>
        </CardContent>
      </Card>
    </div>
  );
} 