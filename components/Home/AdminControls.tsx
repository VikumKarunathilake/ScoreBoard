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

const houseNames: Record<keyof Scores, string> = {
    red: 'Pius',
    blue: 'Bede',
    green: 'Austin',
    yellow: 'Clement',
};

interface AdminControlsProps {
    showAdminControls: boolean;
    onToggleControls: () => void;
    onAddPoints: (house: keyof Scores, points: number, event: string) => void;
    onResetScores: () => void;
}

export function AdminControls({
    showAdminControls,
    onToggleControls,
    onAddPoints,
    onResetScores,
}: AdminControlsProps) {
    return (
        <Card className="mb-8">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Admin Controls</CardTitle>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" size="sm">
                                Open Admin Panel
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="mx-auto w-full max-w-2xl">
                                <DrawerHeader>
                                    <DrawerTitle>Admin Controls</DrawerTitle>
                                    <DrawerDescription>
                                        Manage scores and house points
                                    </DrawerDescription>
                                </DrawerHeader>
                                <div className="p-4 pb-0 space-y-6">
                                    <QuickAddPoints onAddPoints={onAddPoints} />
                                    <Separator />
                                    <CustomPoints onAddPoints={onAddPoints} />
                                    <Separator />
                                    <ResetButton onResetScores={onResetScores} />
                                </div>
                                <DrawerFooter>
                                    <DrawerClose asChild>
                                        <Button variant="outline">Close</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </CardHeader>

            {/* Legacy inline controls for backward compatibility */}
            {showAdminControls && (
                <CardContent className="space-y-4">
                    <QuickAddPoints onAddPoints={onAddPoints} />
                    <Separator />
                    <CustomPoints onAddPoints={onAddPoints} />
                    <Separator />
                    <ResetButton onResetScores={onResetScores} />
                </CardContent>
            )}
        </Card>
    );
}

interface QuickAddPointsProps {
    onAddPoints: (house: keyof Scores, points: number, event: string) => void;
}

function QuickAddPoints({ onAddPoints }: QuickAddPointsProps) {
    const handleAddPoints = (house: keyof Scores, points: number, event: string) => {
        onAddPoints(house, points, event);
        toast.success('Points Added', {
            description: `Added ${points} points to ${houseNames[house]}`,
        });
    };

    return (
        <div>
            <h3 className="font-semibold mb-3 text-foreground">Quick Add Points</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.keys(houseNames).map((house) => (
                    <div key={house} className="text-center">
                        <div className="font-semibold mb-2 capitalize text-sm text-foreground">{house}</div>
                        <div className="flex gap-1 justify-center">
                            {[1, 3, 5].map((points) => (
                                <Button
                                    key={points}
                                    onClick={() => handleAddPoints(house as keyof Scores, points, `Event ${points}pts`)}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2 text-xs"
                                >
                                    +{points}
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

interface CustomPointsProps {
    onAddPoints: (house: keyof Scores, points: number, event: string) => void;
}

function CustomPoints({ onAddPoints }: CustomPointsProps) {
    return (
        <div>
            <h3 className="font-semibold mb-2 text-foreground">Custom Points</h3>
            <div className="flex gap-2 flex-wrap">
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
                <Button variant="default" size="sm" className="capitalize">
                    Add to {house}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Points to {houseNames[house]}</DialogTitle>
                    <DialogDescription>
                        Enter the points and event name for {houseNames[house]}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="points" className="text-right">
                                Points
                            </Label>
                            <Input
                                id="points"
                                type="number"
                                min="1"
                                value={points}
                                onChange={(e) => setPoints(e.target.value)}
                                className="col-span-3"
                                placeholder="Enter points"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="event" className="text-right">
                                Event
                            </Label>
                            <Input
                                id="event"
                                value={event}
                                onChange={(e) => setEvent(e.target.value)}
                                className="col-span-3"
                                placeholder="Enter event name"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add Points</Button>
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
                <Button variant="destructive" className="w-full">
                    Reset All Scores
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reset All Scores</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to reset all scores to zero? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleReset}>
                        Reset Scores
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}