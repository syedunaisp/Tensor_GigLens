"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, CheckCircle, PieChart as PieIcon, AlertTriangle, Zap } from "lucide-react";
import { useGigFin } from "@/context/GigFinContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Badge } from "@/components/ui/badge";

export default function LeakShieldPage() {
    const { transactions, userProfile } = useGigFin();

    // Calculate Metrics
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const expenseRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    const monthlyExpenses = totalExpenses;
    const liquidityBuffer = monthlyExpenses > 0 ? (userProfile.currentBalance / monthlyExpenses).toFixed(1) : "N/A";

    const isExpenseHigh = expenseRatio > 60;
    const isLiquidityLow = Number(liquidityBuffer) < 1.0;

    // Mock Expense Data for Pie Chart
    const expenseData = [
        { name: 'Fuel', value: 35 },
        { name: 'Food', value: 25 },
        { name: 'Maintenance', value: 15 },
        { name: 'Data/Phone', value: 10 },
        { name: 'Misc', value: 15 },
    ];
    const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#8884d8'];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">LeakShield Guardrails</h2>
                    <p className="text-muted-foreground">Detect and plug financial leaks before they drain your wallet.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column: Visuals */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieIcon className="h-5 w-5 text-primary" />
                                Expense Breakdown
                            </CardTitle>
                            <CardDescription>Where is your money going?</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Leak Severity Matrix</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="h-4 w-4 text-red-600" />
                                        <span className="font-bold text-red-700 dark:text-red-400">High Risk</span>
                                    </div>
                                    <ul className="text-xs space-y-1 text-red-600/80 dark:text-red-400/80">
                                        <li>• Fuel Spikes (+12%)</li>
                                        <li>• Unplanned EMI</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                        <span className="font-bold text-yellow-700 dark:text-yellow-400">Medium Risk</span>
                                    </div>
                                    <ul className="text-xs space-y-1 text-yellow-600/80 dark:text-yellow-400/80">
                                        <li>• Eating Out Freq.</li>
                                        <li>• Data Overage</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Status & Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Guardrails</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between border-b pb-2">
                                <span>Max EMI Load</span>
                                <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Safe (&lt; 30%)</Badge>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span>Expense Ratio</span>
                                <Badge variant="outline" className={`${isExpenseHigh ? "text-red-600 bg-red-50 border-red-200" : "text-green-600 bg-green-50 border-green-200"}`}>
                                    {isExpenseHigh ? "Warning" : "Healthy"} ({expenseRatio.toFixed(1)}%)
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between border-b pb-2">
                                <span>Liquidity Buffer</span>
                                <Badge variant="outline" className={`${isLiquidityLow ? "text-red-600 bg-red-50 border-red-200" : "text-green-600 bg-green-50 border-green-200"}`}>
                                    {isLiquidityLow ? "Critical" : "Healthy"} ({liquidityBuffer}x)
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Actionable Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isExpenseHigh ? (
                                <Alert variant="destructive">
                                    <ShieldAlert className="h-4 w-4" />
                                    <AlertTitle>High Expense Ratio</AlertTitle>
                                    <AlertDescription>
                                        Your expenses are {expenseRatio.toFixed(0)}% of your income. Consider cutting non-essential costs like 'Eating Out'.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/10">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertTitle className="text-green-800 dark:text-green-300">Expenses Under Control</AlertTitle>
                                    <AlertDescription className="text-green-700 dark:text-green-400">
                                        Great job! Your spending is within healthy limits.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <div className="flex gap-3 items-start p-3 rounded-md bg-secondary/50">
                                    <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Optimize Fuel Costs</p>
                                        <p className="text-xs text-muted-foreground">Fuel is your biggest expense (35%). Try to optimize routes or maintain steady speeds.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start p-3 rounded-md bg-secondary/50">
                                    <ShieldAlert className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Subscription Audit</p>
                                        <p className="text-xs text-muted-foreground">No unused subscriptions detected this month. Keep it up!</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
