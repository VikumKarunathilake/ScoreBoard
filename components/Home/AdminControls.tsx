// components/Home/AdminControls.tsx
import { Scores } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';
import { Settings, Trophy, RotateCcw } from 'lucide-react';

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
    const [selectedHouse, setSelectedHouse] = useState<keyof Scores | null>(null);
    const [points, setPoints] = useState('');
    const [event, setEvent] = useState('');
    const [addPointsOpen, setAddPointsOpen] = useState(false);
    const [resetOpen, setResetOpen] = useState(false);

    const handleAddPoints = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedHouse) return;

        const pointsNum = parseInt(points);
        if (pointsNum > 0 && event.trim()) {
            onAddPoints(selectedHouse, pointsNum, event.trim());
            toast.success('Points Added', {
                description: `Added ${pointsNum} points to ${houseNames[selectedHouse]} for ${event.trim()}`,
            });
            setPoints('');
            setEvent('');
            setSelectedHouse(null);
            setAddPointsOpen(false);
        } else {
            toast.error('Invalid Input', {
                description: 'Please enter valid points and event name.',
            });
        }
    };

    const handleReset = () => {
        onResetScores();
        setResetOpen(false);
    };

    const openAddPointsDrawer = (house: keyof Scores) => {
        setSelectedHouse(house);
        setAddPointsOpen(true);
    };

    return (
        <Card className="border-0 shadow-lg backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Admin Controls</CardTitle>
                        <p className="text-sm text-slate-600">Manage scores and points</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add Points Section */}
                <div>
                    <h3 className="font-semibold mb-3 text-slate-800 flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Add Points
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.keys(houseNames).map((house) => (
                            <Button
                                key={house}
                                variant="outline"
                                className="capitalize border-slate-300 text-slate-700 hover:bg-slate-50"
                                onClick={() => openAddPointsDrawer(house as keyof Scores)}
                            >
                                {houseNames[house as keyof Scores]}
                            </Button>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Reset Scores Section */}
                <Drawer open={resetOpen} onOpenChange={setResetOpen}>
                    <DrawerTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset All Scores
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle className="text-red-600">Reset All Scores</DrawerTitle>
                                <DrawerDescription className="text-slate-600">
                                    This will reset all house scores to zero. This action cannot be undone.
                                </DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                <Button variant="destructive" onClick={handleReset}>
                                    Confirm Reset
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </DrawerContent>
                </Drawer>

                {/* Add Points Drawer */}
                <Drawer open={addPointsOpen} onOpenChange={setAddPointsOpen}>
                    <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                            <DrawerHeader>
                                <DrawerTitle>
                                    Add Points to {selectedHouse ? houseNames[selectedHouse] : ''}
                                </DrawerTitle>
                                <DrawerDescription>
                                    Enter custom points and event details for {selectedHouse ? houseNames[selectedHouse] : ''} house.
                                </DrawerDescription>
                            </DrawerHeader>
                            <form onSubmit={handleAddPoints}>
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
                                <DrawerFooter>
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                        Add Points
                                    </Button>
                                    <DrawerClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </form>
                        </div>
                    </DrawerContent>
                </Drawer>
            </CardContent>
        </Card>
    );
}