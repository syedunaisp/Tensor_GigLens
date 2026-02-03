export interface FinancialMetrics {
    margin: number;       // 0-1 (e.g., 0.20 for 20%)
    liquidityRatio: number; // e.g., 1.5
    expenseRevenueRatio: number; // 0-1
    operationalLeverage: number; // 0-1
}

export function calculateGigLensScore(metrics: FinancialMetrics): number {
    const { margin, liquidityRatio, expenseRevenueRatio, operationalLeverage } = metrics;

    // Normalize inputs to 0-100 scale components

    // Margin Score: Target > 30% is great
    const marginScore = Math.min(margin / 0.30, 1) * 100;

    // Liquidity Score: Target > 2.0 is great
    const liquidityScore = Math.min(liquidityRatio / 2.0, 1) * 100;

    // Efficiency Score: Lower ERR is better. Target < 0.5
    // If ERR is 0.5, score is 100. If ERR is 1.0, score is 0.
    const efficiencyScore = Math.max(0, (1 - expenseRevenueRatio) / 0.5) * 100;
    if (expenseRevenueRatio > 1) {
        // Penalty for burning cash
    }

    // Leverage Score: Lower is better? Or Higher?
    // "OLR = rate / (revenue / months)" -> Rate per task / Avg Monthly Revenue
    // If Rate is high relative to monthly revenue, it means low volume?
    // Let's assume (1-OLR) is good as per requirements: "(1-OLR)*0.1"
    const leverageScore = Math.max(0, (1 - operationalLeverage)) * 100;

    // Weighted Sum
    // score = margin*0.4 + liquidityRatio*0.3 + (1-ERR)*0.2 + (1-OLR)*0.1
    // We use our normalized scores which are 0-100

    const weightedScore =
        (marginScore * 0.4) +
        (liquidityScore * 0.3) +
        (efficiencyScore * 0.2) +
        (leverageScore * 0.1);

    return Math.round(Math.min(100, Math.max(0, weightedScore)));
}

export function getScoreColor(score: number): string {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
}
