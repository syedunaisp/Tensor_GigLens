import { differenceInDays, isSameDay, subDays, parseISO } from "date-fns";

export interface Transaction {
    id: string;
    date: string; // ISO string YYYY-MM-DD
    amount: number;
    type: "income" | "expense";
}

export const calculateCreditScore = (transactions: Transaction[]): number => {
    let score = 300; // Base score

    // 1. Points for days tracked (unique days)
    const uniqueDays = new Set(transactions.map((t) => t.date)).size;
    score += uniqueDays * 10;

    // 2. Points for positive net income
    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    if (totalIncome > totalExpense) {
        score += 50;
    }

    // Cap at 850
    return Math.min(score, 850);
};

export const calculateStreak = (transactions: Transaction[]): number => {
    if (transactions.length === 0) return 0;

    // Sort transactions by date descending
    const sortedDates = Array.from(
        new Set(transactions.map((t) => t.date))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (sortedDates.length === 0) return 0;

    const today = new Date();
    const lastEntryDate = parseISO(sortedDates[0]);

    // If last entry was not today or yesterday, streak is broken (unless we want to be lenient)
    // For strict streak:
    if (differenceInDays(today, lastEntryDate) > 1) {
        return 0;
    }

    let streak = 1;
    let currentDate = lastEntryDate;

    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = parseISO(sortedDates[i]);
        const diff = differenceInDays(currentDate, prevDate);

        if (diff === 1) {
            streak++;
            currentDate = prevDate;
        } else {
            break;
        }
    }

    return streak;
};

export const getLevel = (streak: number) => {
    if (streak >= 30) return { name: "Master Fleet", nextThreshold: null, progress: 100 };
    if (streak >= 7) return { name: "Pro Driver", nextThreshold: 30, progress: ((streak - 7) / (30 - 7)) * 100 };
    return { name: "Rookie", nextThreshold: 7, progress: (streak / 7) * 100 };
};
