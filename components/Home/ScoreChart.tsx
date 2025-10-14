// components/Home/ScoreChart.tsx
import { Scores } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Pie, PieChart, Cell } from 'recharts';

interface ScoreChartProps {
    scores: Scores;
}

const houseColors: Record<keyof Scores, string> = {
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
};

const houseNames: Record<keyof Scores, string> = {
    red: 'Pius',
    blue: 'Bede',
    green: 'Austin',
    yellow: 'Clement',
};

export function ScoreChart({ scores }: ScoreChartProps) {
    const chartData = Object.entries(scores).map(([house, score]) => ({
        house: houseNames[house as keyof Scores],
        score,
        color: houseColors[house as keyof Scores],
        shortName: house.charAt(0).toUpperCase(),
    }));

    const sortedData = [...chartData].sort((a, b) => b.score - a.score);
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="border border-slate-200 p-3 rounded-lg shadow-lg">
                    <p className="font-semibold text-slate-800">{label}</p>
                    <p className="text-slate-600">
                        Score: <span className="font-semibold">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="  border border-slate-200 p-3 rounded-lg shadow-lg">
                    <p className="font-semibold text-slate-800">{payload[0].payload.house}</p>
                    <p className="text-slate-600">
                        Score: <span className="font-semibold">{payload[0].value}</span>
                    </p>
                    <p className="text-slate-600">
                        Percentage: <span className="font-semibold">
                            {((payload[0].value / totalScore) * 100).toFixed(1)}%
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg  /80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-slate-800">Score Comparison</CardTitle>
                    <CardDescription className="text-slate-600">
                        Visual representation of house scores
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sortedData}>
                            <XAxis
                                dataKey="shortName"
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#64748b"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="score"
                                radius={[6, 6, 0, 0]}
                            >
                                {sortedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="border-0 shadow-lg  /80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-slate-800">Score Distribution</CardTitle>
                    <CardDescription className="text-slate-600">
                        Percentage breakdown of total points
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ house, percent }) =>
                                    `${house}: ${(percent * 100).toFixed(0)}%`
                                }
                                outerRadius={100}
                                innerRadius={60}
                                paddingAngle={2}
                                dataKey="score"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-0 shadow-lg  /80 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-slate-800">Current Standings</CardTitle>
                    <CardDescription className="text-slate-600">
                        Detailed house rankings and statistics
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sortedData.map((house, index) => (
                            <div key={house.house} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl  /50 backdrop-blur-sm">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full   border border-slate-200 shadow-sm">
                                        <span className="text-2xl">
                                            {index === 0 ? '🥇' :
                                                index === 1 ? '🥈' :
                                                    index === 2 ? '🥉' : `${index + 1}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-4 h-4 rounded-full shadow-sm"
                                            style={{ backgroundColor: house.color }}
                                        />
                                        <span className="font-semibold text-slate-800 text-lg">{house.house}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-800">{house.score}</div>
                                    {totalScore > 0 && (
                                        <div className="text-sm text-slate-500">
                                            {((house.score / totalScore) * 100).toFixed(1)}% of total
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}