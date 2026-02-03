"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useGigFin } from "@/context/GigFinContext";
import { useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface RevenueChartProps {
    title?: string;
}

export function RevenueChart({ title }: RevenueChartProps) {
    const { transactions } = useGigFin();
    const { t } = useLanguage();

    const displayTitle = title || "Last 30 Days Summary";

    const { currentMonthIncome, currentMonthExpense } = useMemo(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        let income = 0;
        let expense = 0;

        transactions.forEach(t => {
            const tDate = new Date(t.date);
            if (tDate >= thirtyDaysAgo && tDate <= today) {
                if (t.type === 'income') income += t.amount;
                if (t.type === 'expense') expense += t.amount;
            }
        });

        return { currentMonthIncome: income, currentMonthExpense: expense };
    }, [transactions]);

    // Calculate percentages relative to a dynamic max (e.g. Income + Buffer, or fixed 30k target)
    const maxVal = Math.max(currentMonthIncome * 1.2, 30000);

    const incomePercent = maxVal > 0 ? (currentMonthIncome / maxVal) * 100 : 0;
    const expensePercent = maxVal > 0 ? (currentMonthExpense / maxVal) * 100 : 0;

    return (
        <Card className="col-span-4 border-none shadow-xl rounded-2xl border-t-4 border-orange-500 bg-white dark:bg-slate-900">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {displayTitle}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Money Earned */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            {t.earned}
                        </span>
                        <span className="text-lg font-bold text-green-700 dark:text-green-400">₹{currentMonthIncome.toLocaleString()}</span>
                    </div>
                    <Progress value={incomePercent} className="h-3 bg-green-100 dark:bg-green-900/20" indicatorClassName="bg-green-600" />
                </div>

                {/* Money Spent */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <TrendingDown className="h-4 w-4 text-orange-600" />
                            {t.spent}
                        </span>
                        <span className="text-lg font-bold text-orange-700 dark:text-orange-400">₹{currentMonthExpense.toLocaleString()}</span>
                    </div>
                    <Progress value={expensePercent} className="h-3 bg-orange-100 dark:bg-orange-900/20" indicatorClassName="bg-orange-600" />
                </div>

                <div className="pt-2 text-xs text-muted-foreground text-center">
                    Keep '{t.spent}' lower than '{t.earned}' to save more!
                </div>
            </CardContent>
        </Card>
    );
}
