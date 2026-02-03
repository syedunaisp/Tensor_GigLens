"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, AlertTriangle, TrendingDown, TrendingUp, Info, ShieldCheck } from "lucide-react";
import { useMLSimulation } from "@/hooks/useMLSimulation";
import { useGigFin } from "@/context/GigFinContext";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export function StressSimulator() {
    const { userProfile, transactions } = useGigFin();
    const { runStressTest } = useMLSimulation(transactions, userProfile.currentBalance, userProfile.goals);

    // Simulation State
    const [fuelPrice, setFuelPrice] = useState(96);
    const [orderVolume, setOrderVolume] = useState(100);
    const [medicalEmergency, setMedicalEmergency] = useState(false);
    const [bikeRepair, setBikeRepair] = useState(0);
    const [challan, setChallan] = useState(0);
    const [inflation, setInflation] = useState(6);
    const [platformFee, setPlatformFee] = useState(20);

    // Calculate Score
    const survivalScore = runStressTest(fuelPrice, orderVolume, medicalEmergency, bikeRepair, challan, inflation, platformFee);

    // Reactive Data Generator for Chart
    const chartData = useMemo(() => {
        const data = [];
        let currentBalance = userProfile.currentBalance || 0;

        for (let i = 0; i < 30; i++) {
            // Daily Logic
            // DailyIncome = (800 * (orderVolume / 100))
            const dailyIncome = 800 * (orderVolume / 100);

            // DailyFuelCost = (fuelPrice * 3)
            const dailyFuelCost = fuelPrice * 3;

            // DailyExpense = DailyFuelCost + (200 * (1 + inflation/100))
            const dailyExpense = dailyFuelCost + (200 * (1 + inflation / 100));

            // NetChange = DailyIncome - DailyExpense
            const netChange = dailyIncome - dailyExpense;

            // Accumulator
            currentBalance += netChange;

            // Shock Logic: If medicalEmergency is true, subtract 5000 from the balance on Day 5
            if (i === 4 && medicalEmergency) {
                currentBalance -= 5000;
            }

            // Include other manual shocks (Bike Repair, Challan) on Day 1 for completeness
            if (i === 0) {
                currentBalance -= (bikeRepair + challan);
            }

            // Push to Array
            data.push({
                day: `Day ${i + 1}`,
                balance: Math.round(currentBalance),
            });
        }
        return data;
    }, [userProfile.currentBalance, fuelPrice, orderVolume, inflation, medicalEmergency, bikeRepair, challan]);

    // Presets
    const applyPreset = (preset: string) => {
        switch (preset) {
            case 'pandemic':
                setOrderVolume(60);
                setMedicalEmergency(true);
                setInflation(8);
                break;
            case 'fuel_hike':
                setFuelPrice(110);
                setInflation(10);
                break;
            case 'festival':
                setOrderVolume(140);
                setPlatformFee(15); // Promo
                break;
            case 'reset':
                setFuelPrice(96);
                setOrderVolume(100);
                setMedicalEmergency(false);
                setBikeRepair(0);
                setChallan(0);
                setInflation(6);
                setPlatformFee(20);
                break;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Stress Simulator</h2>
                    <p className="text-muted-foreground">Test your financial resilience against real-world risks.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => applyPreset('pandemic')}>Pandemic Mode</Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('fuel_hike')}>Fuel Hike</Button>
                    <Button variant="outline" size="sm" onClick={() => applyPreset('festival')} className="text-green-600 border-green-200 bg-green-50 hover:bg-green-100">Festival Season</Button>
                    <Button variant="ghost" size="sm" onClick={() => applyPreset('reset')}>Reset</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Controls Column */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            Stress Factors
                        </CardTitle>
                        <CardDescription>Adjust variables to simulate scenarios</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Market Conditions */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Market Conditions</h4>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Fuel Price</span>
                                    <span className="font-bold">₹{fuelPrice}/L</span>
                                </div>
                                <Slider value={[fuelPrice]} min={90} max={120} step={1} onValueChange={(v) => setFuelPrice(v[0])} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Order Volume</span>
                                    <span className="font-bold">{orderVolume}%</span>
                                </div>
                                <Slider value={[orderVolume]} min={50} max={150} step={5} onValueChange={(v) => setOrderVolume(v[0])} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Inflation</span>
                                    <span className="font-bold">{inflation}%</span>
                                </div>
                                <Slider value={[inflation]} min={4} max={15} step={0.5} onValueChange={(v) => setInflation(v[0])} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Platform Fee</span>
                                    <span className="font-bold">{platformFee}%</span>
                                </div>
                                <Slider value={[platformFee]} min={10} max={35} step={1} onValueChange={(v) => setPlatformFee(v[0])} />
                            </div>
                        </div>

                        {/* Shocks */}
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Financial Shocks</h4>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-medium">Medical Emergency</label>
                                    <p className="text-xs text-muted-foreground">Simulate ₹5,000 shock</p>
                                </div>
                                <Switch checked={medicalEmergency} onCheckedChange={setMedicalEmergency} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Bike Repair (₹)</label>
                                    <Input type="number" value={bikeRepair} onChange={(e) => setBikeRepair(Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Challan (₹)</label>
                                    <Input type="number" value={challan} onChange={(e) => setChallan(Number(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Visualization Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Score Card */}
                    <Card className={cn("border-l-4 transition-all duration-500",
                        survivalScore > 80 ? "border-l-green-500 bg-green-50/50 dark:bg-green-900/10" :
                            survivalScore < 50 ? "border-l-destructive bg-red-50/50 dark:bg-red-900/10" :
                                "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10"
                    )}>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between">
                                <span>Survival Score</span>
                                <Activity className={cn("h-6 w-6",
                                    survivalScore > 80 ? "text-green-600" :
                                        survivalScore < 50 ? "text-destructive" : "text-yellow-600"
                                )} />
                            </CardTitle>
                            <CardDescription>Based on your current balance and selected stress factors.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2">
                                <span className={cn("text-5xl font-bold",
                                    survivalScore > 80 ? "text-green-600" :
                                        survivalScore < 50 ? "text-destructive" : "text-yellow-600"
                                )}>
                                    {survivalScore}
                                </span>
                                <span className="text-xl text-muted-foreground mb-1">/ 100</span>
                            </div>
                            <div className="mt-4 flex gap-2">
                                {survivalScore < 50 && (
                                    <Badge variant="destructive" className="flex gap-1">
                                        <AlertTriangle className="h-3 w-3" /> Critical Risk
                                    </Badge>
                                )}
                                {medicalEmergency && <Badge variant="outline" className="text-red-500 border-red-200">Medical Emergency Active</Badge>}
                                {inflation > 8 && <Badge variant="outline" className="text-orange-500 border-orange-200">High Inflation</Badge>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Projection Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-500" />
                                30-Day Cashflow Projection
                            </CardTitle>
                            <CardDescription>Estimated balance trajectory under these conditions.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                                    <XAxis dataKey="day" />
                                    <YAxis domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                        formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Balance']}
                                    />
                                    <ReferenceLine y={0} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                                    <Line
                                        type="monotone"
                                        dataKey="balance"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Survival Tips */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Info className="h-5 w-5 text-purple-500" />
                                AI Survival Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                {survivalScore < 50 ? (
                                    <>
                                        <li className="flex gap-2 items-start text-destructive">
                                            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                                            <span><strong>Immediate Action:</strong> Your balance is projected to hit zero. Consider pausing all non-essential subscriptions immediately.</span>
                                        </li>
                                        <li className="flex gap-2 items-start">
                                            <Zap className="h-4 w-4 mt-0.5 shrink-0 text-yellow-500" />
                                            <span>Look for high-demand zones (Surge Pricing) to offset the {orderVolume < 100 ? 'low order volume' : 'high costs'}.</span>
                                        </li>
                                    </>
                                ) : survivalScore < 80 ? (
                                    <>
                                        <li className="flex gap-2 items-start">
                                            <TrendingDown className="h-4 w-4 mt-0.5 shrink-0 text-orange-500" />
                                            <span>Your buffer is thinning. Try to increase daily savings by ₹50 to build a safety net.</span>
                                        </li>
                                        <li className="flex gap-2 items-start">
                                            <Info className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
                                            <span>Consider a "No-Spend Day" challenge this week to recover from the simulated shocks.</span>
                                        </li>
                                    </>
                                ) : (
                                    <li className="flex gap-2 items-start text-green-600">
                                        <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
                                        <span><strong>Great Resilience!</strong> Your finances can withstand these stress levels. Consider moving excess funds to a high-yield savings goal.</span>
                                    </li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
