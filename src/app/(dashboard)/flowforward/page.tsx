"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { useGigFin } from "@/context/GigFinContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function FlowForwardPage() {
    const { userProfile, transactions } = useGigFin();

    // Calculate Metrics
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);

    const dailyExpense = totalExpenses / 30; // Assuming 30 days data
    const runwayDays = dailyExpense > 0 ? Math.floor(userProfile.currentBalance / dailyExpense) : 999;

    const netCashflow = totalIncome - totalExpenses;
    const projectedCashflow = Math.round(netCashflow);

    const remainingGoal = Math.max(0, 50000 - userProfile.currentBalance); // Hardcoded goal for now if not in profile
    const dailySaveTarget = Math.round(remainingGoal / 90);

    // Mock Forecast Data
    const forecastData = [
        { day: 'Mon', income: 1200, target: 1000 },
        { day: 'Tue', income: 1100, target: 1000 },
        { day: 'Wed', income: 900, target: 1000 },
        { day: 'Thu', income: 1300, target: 1000 },
        { day: 'Fri', income: 1500, target: 1200 },
        { day: 'Sat', income: 1800, target: 1500 },
        { day: 'Sun', income: 1600, target: 1500 },
    ];

    // Mock Heatmap Data (Simplified as grid)
    const bestTimes = [
        { time: 'Morning (8-11 AM)', demand: 'High', surge: '1.2x' },
        { time: 'Afternoon (1-4 PM)', demand: 'Medium', surge: '1.0x' },
        { time: 'Evening (6-10 PM)', demand: 'Very High', surge: '1.5x' },
        { time: 'Night (11 PM+)', demand: 'Low', surge: '1.1x' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">FlowForward</h2>
                    <p className="text-muted-foreground">Predictive insights to maximize your future earnings.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Safe Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-4xl font-bold ${runwayDays < 30 ? "text-red-600" : "text-primary"}`}>
                            {runwayDays > 365 ? "365+" : runwayDays} Days
                        </div>
                        <p className="text-xs text-muted-foreground">Runway in stressed scenario</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Daily Save Target</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">₹{dailySaveTarget}</div>
                        <p className="text-xs text-muted-foreground">To reach goal in 3 months</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Next Month Projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-4xl font-bold ${projectedCashflow >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {projectedCashflow >= 0 ? "+" : "-"}₹{Math.abs(projectedCashflow)}
                        </div>
                        <p className="text-xs text-muted-foreground">Estimated Net Cashflow</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            Income Forecast (Next 7 Days)
                        </CardTitle>
                        <CardDescription>Predicted earnings based on historical trends.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                                <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Predicted Income" />
                                <Bar dataKey="target" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} name="Target" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-orange-500" />
                            Best Time to Work
                        </CardTitle>
                        <CardDescription>Maximize earnings with surge pricing insights.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {bestTimes.map((slot, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${slot.demand === 'Very High' ? 'bg-red-500' : slot.demand === 'High' ? 'bg-orange-500' : slot.demand === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                        <div>
                                            <p className="font-medium">{slot.time}</p>
                                            <p className="text-xs text-muted-foreground">Demand: {slot.demand}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="font-bold">
                                        {slot.surge} Surge
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <RevenueChart />
        </div>
    );
}
