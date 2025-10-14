// components/Home/ScoreChart.tsx
import { Scores } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Pie, PieChart, Cell } from 'recharts';

interface ScoreChartProps {
    scores: Scores;
}

const houseColors: Record<keyof Scores, string> = {
    red: '#ef4444', // bg-red-500
    blue: '#3b82f6', // bg-blue-500
    green: '#22c55e', // bg-green-500
    yellow: '#eab308', // bg-yellow-500
};

const houseNames: Record<keyof Scores, string> = {
    red: 'Pius',
    blue: 'Bede',
    green: 'Austin',
    yellow: 'Clement',
};

export function ScoreChart({ scores }: ScoreChartProps) {
    // Prepare data for charts
    const chartData = Object.entries(scores).map(([house, score]) => ({
        house: houseNames[house as keyof Scores],
        score,
        color: houseColors[house as keyof Scores],
        shortName: house.charAt(0).toUpperCase() + house.slice(1),
    }));

    const sortedData = [...chartData].sort((a, b) => b.score - a.score);

    // Custom tooltip for bar chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
                    <p className="font-semibold text-foreground">{label}</p>
                    <p className="text-foreground">
                        Score: <span className="font-semibold">{payload[0].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom tooltip for pie chart
    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
                    <p className="font-semibold text-foreground">{payload[0].payload.house}</p>
                    <p className="text-foreground">
                        Score: <span className="font-semibold">{payload[0].value}</span>
                    </p>
                    <p className="text-foreground">
                        Percentage: <span className="font-semibold">
                            {((payload[0].value / totalScore) * 100).toFixed(1)}%
                        </span>
                    </p>
                </div>
            );
        }
        return null;
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>House Scores Comparison</CardTitle>
                    <CardDescription>
                        Visual comparison of all house scores
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={sortedData}>
                            <XAxis
                                dataKey="shortName"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="score"
                                radius={[4, 4, 0, 0]}
                            >
                                {sortedData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Score Distribution</CardTitle>
                    <CardDescription>
                        Percentage distribution of total points
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
                                label={({ house, score, percent }) =>
                                    `${house}: ${score} (${(percent * 100).toFixed(0)}%)`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="score"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomPieTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Leaderboard Card */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Current Standings</CardTitle>
                    <CardDescription>
                        Detailed breakdown of house rankings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sortedData.map((house, index) => (
                            <div key={house.house} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: house.color }}
                                    />
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">
                                            {index === 0 ? '🥇' :
                                                index === 1 ? '🥈' :
                                                    index === 2 ? '🥉' : `${index + 1}.`}
                                        </span>
                                        <span className="font-semibold text-foreground">{house.house}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-foreground">{house.score}</div>
                                    {totalScore > 0 && (
                                        <div className="text-sm text-muted-foreground">
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