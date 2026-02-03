"use client";

import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGigFin } from "@/context/GigFinContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LabelList } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Award } from "lucide-react";

export default function GigLensScorePage() {
    const { calculateKarmaScore, userProfile } = useGigFin();
    const score = calculateKarmaScore();
    const segment = score >= 80 ? "Growth Striver" : score >= 50 ? "Stable Earner" : "Needs Improvement";

    // Mock Historical Data
    const historyData = [
        { month: 'Jan', score: 620 },
        { month: 'Feb', score: 635 },
        { month: 'Mar', score: 645 },
        { month: 'Apr', score: 640 },
        { month: 'May', score: 655 },
        { month: 'Jun', score: score },
    ];

    // Mock Peer Data
    const peerData = [
        { name: 'Bottom 20%', value: 550 },
        { name: 'Average', value: 680 },
        { name: 'You', value: score },
        { name: 'Top 20%', value: 750 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">GigLens Score</h2>
                    <p className="text-muted-foreground">Your financial reputation and creditworthiness.</p>
                </div>
                <Badge variant="outline" className="text-lg py-1 px-3 border-primary/20 bg-primary/5">
                    <Award className="w-4 h-4 mr-2 text-primary" />
                    {segment}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <ScoreCard score={score} segment={segment} />

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                Score History
                            </CardTitle>
                            <CardDescription>Your score growth over the last 6 months.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historyData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis domain={[500, 850]} hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Breakdown</CardTitle>
                            <CardDescription>Factors impacting your current score.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Margin Health</span>
                                        <span className="text-sm text-green-600 font-bold">Excellent (85/100)</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary">
                                        <div className="h-2 w-[85%] rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Consistent surplus income vs expenses.</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Liquidity Buffer</span>
                                        <span className="text-sm text-yellow-600 font-bold">Good (65/100)</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary">
                                        <div className="h-2 w-[65%] rounded-full bg-yellow-500" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Can survive ~20 days without income.</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Expense Stability</span>
                                        <span className="text-sm text-green-600 font-bold">Healthy (75/100)</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-secondary">
                                        <div className="h-2 w-[75%] rounded-full bg-green-500" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">No major unexpected spikes recently.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-500" />
                                Peer Comparison
                            </CardTitle>
                            <CardDescription>How you stack up against other Gig Workers.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={peerData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis hide />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {peerData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.name === 'You' ? '#eab308' : '#4b5563'} />
                                        ))}
                                        <LabelList dataKey="value" position="top" className="fill-foreground font-bold text-xs" />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
