export interface ForecastInput {
    dailyRevenue: number[]; // Last 30 days revenue
    dailyExpenses: number[]; // Last 30 days expenses
    currentCash: number;
}

export interface ForecastResult {
    base: number[];
    optimistic: number[];
    stressed: number[];
    safeDays: number;
    dailySaveTarget: number;
}

export function generateForecast(input: ForecastInput, days = 30): ForecastResult {
    const { dailyRevenue, dailyExpenses, currentCash } = input;

    // Simple average daily net flow
    const avgRev = dailyRevenue.reduce((a, b) => a + b, 0) / (dailyRevenue.length || 1);
    const avgExp = dailyExpenses.reduce((a, b) => a + b, 0) / (dailyExpenses.length || 1);
    const netFlow = avgRev - avgExp;

    // Base Case: Continue current trend
    const base = [];
    let cash = currentCash;
    for (let i = 0; i < days; i++) {
        cash += netFlow;
        base.push(cash);
    }

    // Optimistic: +10% Revenue, -5% Expenses
    const optNetFlow = (avgRev * 1.1) - (avgExp * 0.95);
    const optimistic = [];
    cash = currentCash;
    for (let i = 0; i < days; i++) {
        cash += optNetFlow;
        optimistic.push(cash);
    }

    // Stressed: -20% Revenue, +10% Expenses
    const stressNetFlow = (avgRev * 0.8) - (avgExp * 1.1);
    const stressed = [];
    cash = currentCash;
    for (let i = 0; i < days; i++) {
        cash += stressNetFlow;
        stressed.push(cash);
    }

    // Safe Days: How long until cash < 0 in Stressed scenario?
    let safeDays = days;
    for (let i = 0; i < days; i++) {
        if (stressed[i] < 0) {
            safeDays = i;
            break;
        }
    }
    // If still positive after 30 days, extrapolate
    if (safeDays === days && stressNetFlow < 0) {
        safeDays = Math.floor(currentCash / Math.abs(stressNetFlow));
    } else if (stressNetFlow >= 0) {
        safeDays = 999; // Infinite runway
    }

    // Daily Save Target: To reach 3 months expenses in 6 months
    // Target = (3 * 30 * avgExp) - currentCash
    // Daily = Target / (6 * 30)
    const targetBuffer = 3 * 30 * avgExp;
    const gap = Math.max(0, targetBuffer - currentCash);
    const dailySaveTarget = gap / (6 * 30);

    return { base, optimistic, stressed, safeDays, dailySaveTarget };
}
