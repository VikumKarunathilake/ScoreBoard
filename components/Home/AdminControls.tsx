// components/Home/AdminControls.tsx
import { Scores } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Settings, Trophy, RotateCcw } from 'lucide-react';

const houseNames: Record<keyof Scores, string> = {
    red: 'Pius',
    blue: 'Bede',
    green: 'Austin',
    yellow: 'Clement',
};

interface AdminControlsProps {
    onAddPoints: (house: keyof Scores, points: number, event: string) => void;
    onResetScores: () => void;
}

export function AdminControls({ onAddPoints, onResetScores }: AdminControlsProps) {
    return (
        <Card className="border-0 shadow-lg  /80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Settings className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Admin Controls</CardTitle>
                            <p className="text-sm text-slate-600">Manage scores and points</p>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <CustomPoints onAddPoints={onAddPoints} />
                <Separator />
                <ResetButton onResetScores={onResetScores} />
            </CardContent>
        </Card>
    );
}

interface QuickAddPointsProps {
    onAddPoints: (house: keyof Scores, points: number, event: string) => void;
}


interface CustomPointsProps {
    onAddPoints: (house: keyof Scores, points: number, event: string) => void;
}

function CustomPoints({ onAddPoints }: CustomPointsProps) {
    return (
        <div>
            <h3 className="font-semibold mb-3 text-slate-800 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Add Points
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.keys(houseNames).map((house) => (
                    <CustomPointsDialog
                        key={house}
                        house={house as keyof Scores}
                        onAddPoints={onAddPoints}
                    />
                ))}
            </div>
        </div>
    );
}

interface CustomPointsDialogProps {
    house: keyof Scores;
    onAddPoints: (house: keyof Scores, points: number, event: string) => void;
}

function CustomPointsDialog({ house, onAddPoints }: CustomPointsDialogProps) {
    const [points, setPoints] = useState('');
    const [event, setEvent] = useState('');
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pointsNum = parseInt(points);
        if (pointsNum > 0 && event.trim()) {
            onAddPoints(house, pointsNum, event.trim());
            toast.success('Points Added', {
                description: `Added ${pointsNum} points to ${houseNames[house]} for ${event.trim()}`,
            });
            setPoints('');
            setEvent('');
            setOpen(false);
        } else {
            toast.error('Invalid Input', {
                description: 'Please enter valid points and event name.',
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="capitalize border-slate-300 text-slate-700 hover:bg-slate-50">
                    {houseNames[house]}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Points to {houseNames[house]}</DialogTitle>
                    <DialogDescription>
                        Enter custom points and event details for {houseNames[house]} house.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="points" className="text-slate-700">
                                Points
                            </Label>
                            <Input
                                id="points"
                                type="number"
                                min="1"
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                placeholder="Enter points"
                                className="border-slate-300 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="event" className="text-slate-700">
                                Event Name
                            </Label>
                            <Input
                                id="event"
                                value={event}
                                onChange={(e) => setEvent(e.target.value)}
                                placeholder="Enter event name"
                                className="border-slate-300 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Add Points
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

interface ResetButtonProps {
    onResetScores: () => void;
}

function ResetButton({ onResetScores }: ResetButtonProps) {
    const [open, setOpen] = useState(false);

    const handleReset = () => {
        onResetScores();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset All Scores
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-red-600">Reset All Scores</DialogTitle>
                    <DialogDescription className="text-slate-600">
                        This will reset all house scores to zero. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-1">
                    <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-300">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReset}>
                        Confirm Reset
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}