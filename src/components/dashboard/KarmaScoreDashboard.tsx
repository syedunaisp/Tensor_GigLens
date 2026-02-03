"use client";

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock, Zap, TrendingUp, Calendar, Flame, Wallet, Shield, Handshake } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { SalarySlider } from "@/components/dashboard/SalarySlider";
import { useGigFin } from "@/context/GigFinContext";

export function KarmaScoreDashboard() {
    const { transactions, calculateKarmaScore } = useGigFin();

    // --- 1. The "KarmaScore" Algorithm (Using Context Logic) ---
    const score = calculateKarmaScore();

    // Calculate Factors for Display
    const { consistency, avgEarnings, streak } = useMemo(() => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const recentTx = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate >= sevenDaysAgo && tDate <= today && t.type === 'income';
        });

        const uniqueDaysWorked = new Set(recentTx.filter(t => t.amount > 0).map(t => t.date)).size;
        const totalWeekEarnings = recentTx.reduce((sum, t) => sum + t.amount, 0);
        const avgDaily = uniqueDaysWorked > 0 ? totalWeekEarnings / uniqueDaysWorked : 0;

        // Streak (Simplified for display - ideally comes from context/profile)
        let currentStreak = 0;
        const sortedDates = Array.from(new Set(transactions.filter(t => t.type === 'income' && t.amount > 0).map(t => t.date)))
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        if (sortedDates.length > 0) currentStreak = 1; // Minimal check

        return {
            consistency: uniqueDaysWorked,
            avgEarnings: Math.round(avgDaily),
            streak: currentStreak
        };
    }, [transactions]);

    // --- 2. Visual UI Logic ---
    const getColor = (s: number) => {
        if (s < 50) return "#ef4444"; // Red
        if (s < 75) return "#eab308"; // Yellow
        return "#22c55e"; // Green
    };

    const scoreColor = getColor(score);

    // Gauge Data
    const gaugeData = [
        { name: 'Score', value: score, fill: scoreColor },
        { name: 'Remaining', value: 100 - score, fill: '#e2e8f0' },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Karma Score Gauge & Factors */}
            <Card className="lg:col-span-1 border-none shadow-xl rounded-2xl border-t-4 border-orange-500 bg-white dark:bg-slate-900">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-white">
                        <Shield className="h-6 w-6 text-orange-500 fill-orange-100" />
                        Trust Badge (भरोसा)
                    </CardTitle>
                    <CardDescription className="text-base text-gray-500">Your worker reputation</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    {/* Score Gauge */}
                    <div className="h-48 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gaugeData}
                                    cx="50%"
                                    cy="70%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={0}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {gaugeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 pointer-events-none">
                            <span className="text-4xl font-bold" style={{ color: scoreColor }}>{score}/100</span>
                            <span className="text-sm font-medium text-muted-foreground">
                                {score >= 75 ? "Good Standing" : score >= 50 ? "Fair" : "Needs Improvement"}
                            </span>
                        </div>
                    </div>

                    {/* Factors Display */}
                    <div className="grid grid-cols-3 gap-2 w-full mt-4">
                        <div className="flex flex-col items-center p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                            <Calendar className="h-4 w-4 text-blue-500 mb-1" />
                            <span className="text-xs text-muted-foreground">Consistency</span>
                            <span className="text-sm font-bold">{consistency}/7 Days</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-orange-50 dark:bg-slate-800 rounded-xl text-center border border-orange-100">
                            <Handshake className="h-4 w-4 text-orange-500 mb-1" />
                            <span className="text-xs text-muted-foreground">Money Earned</span>
                            <span className="text-sm font-bold">₹{avgEarnings}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-slate-800 rounded-xl text-center border border-blue-100">
                            <Flame className="h-4 w-4 text-blue-500 mb-1" />
                            <span className="text-xs text-muted-foreground">Streak</span>
                            <span className="text-sm font-bold">{streak} Days</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Right Column: Salary-on-Demand */}
            <div className="lg:col-span-2">
                <SalarySlider />
            </div>
        </div>
    );
}
