/**
 * Voice Agent Data Aggregation Utility
 * 
 * This module aggregates all backend and ML-computed data into a structured
 * format for the voice agent. It READS from existing ML functions and contexts
 * but does NOT modify any logic.
 * 
 * ARCHITECTURE RULE: This is a READ-ONLY data layer.
 * All computations are done by existing ML functions.
 */

import { 
    BackendFinancialData, 
    FinancialStatus, 
    DetectedLeak,
    GoalProgress,
    ForecastSummary,
    TransactionSummary,
    UserLevel
} from '@/types/voice-agent';
import { Transaction, UserProfile, Goal } from '@/context/GigFinContext';
import { calculateGigLensScore, FinancialMetrics } from '@/lib/scoring';
import { generateForecast, ForecastInput } from '@/lib/forecast';
import { calculateStreak, getLevel } from '@/lib/gamification';

/**
 * Aggregates all available financial data for the voice agent.
 * 
 * @param userProfile - User profile from GigFinContext
 * @param transactions - Transaction history from GigFinContext
 * @param karmaScore - Pre-calculated karma score from GigFinContext.calculateKarmaScore()
 * @param detectedLeaks - Pre-calculated leaks from useMLSimulation
 * @returns Structured backend data for voice agent
 */
export function aggregateVoiceAgentData(
    userProfile: UserProfile,
    transactions: Transaction[],
    karmaScore: number,
    detectedLeaks: { id: string; type: string; amount: number; risk: string }[] = []
): BackendFinancialData {
    
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Calculate monthly income from annual
    const monthlyIncome = Math.round(userProfile.annualIncome / 12);
    
    // Calculate recent transaction summary (last 7 days)
    const recentTransactions = transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= sevenDaysAgo && txDate <= now;
    });
    
    const recentActivity = calculateRecentActivity(recentTransactions);
    
    // Calculate GigLens score using existing scoring function
    const metrics = calculateFinancialMetrics(userProfile, transactions);
    const gigLensScore = calculateGigLensScore(metrics);
    
    // Calculate streak and level using existing gamification functions
    const streak = calculateStreak(transactions.map(t => ({
        id: t.id,
        date: t.date,
        amount: t.amount,
        type: t.type as 'income' | 'expense'
    })));
    const levelInfo = getLevel(streak);
    
    // Generate forecast using existing forecast function
    const forecastData = calculateForecast(transactions, userProfile.currentBalance);
    
    // Calculate goal progress
    const goals = calculateGoalProgress(userProfile.goals || []);
    const totalGoalProgress = calculateTotalGoalProgress(goals);
    
    // Determine overall financial status
    const { status, reason } = determineFinancialStatus(
        gigLensScore,
        karmaScore,
        userProfile.gigCreditScore,
        forecastData.safeDays,
        detectedLeaks.length
    );
    
    // Calculate total leak amount
    const totalLeakAmount = detectedLeaks.reduce((sum, leak) => sum + leak.amount, 0);
    
    // Check if we have complete data
    const hasCompleteData = !!(
        userProfile.currentBalance !== undefined &&
        userProfile.gigCreditScore &&
        transactions.length > 0
    );
    
    return {
        // User identification
        userName: userProfile.name || 'User',
        
        // Core financial metrics
        currentBalance: userProfile.currentBalance,
        annualIncome: userProfile.annualIncome,
        monthlyIncome,
        monthlyExpenses: userProfile.monthlyExpenses,
        
        // ML-predicted scores
        gigCreditScore: userProfile.gigCreditScore,
        approvalProbability: typeof userProfile.approvalProbability === 'number' 
            ? userProfile.approvalProbability 
            : parseApprovalProbability(userProfile.approvalProbability),
        maxLoanAmount: userProfile.maxLoanAmount,
        
        // Computed scores
        karmaScore,
        gigLensScore,
        
        // Gamification
        streak,
        level: levelInfo.name as UserLevel,
        levelProgress: Math.round(levelInfo.progress),
        
        // Financial status
        overallStatus: status,
        statusReason: reason,
        
        // Leak detection
        detectedLeaks: detectedLeaks.map(leak => ({
            id: leak.id,
            type: leak.type as DetectedLeak['type'],
            amount: leak.amount,
            risk: leak.risk as DetectedLeak['risk']
        })),
        totalLeakAmount,
        
        // Goals
        goals,
        totalGoalProgress,
        
        // Forecast
        forecast: forecastData,
        
        // Recent activity
        recentActivity,
        
        // Metadata
        dataTimestamp: now.toISOString(),
        hasCompleteData
    };
}

/**
 * Calculate financial metrics for GigLens score
 * Uses data from profile and transactions - NO NEW LOGIC
 */
function calculateFinancialMetrics(
    userProfile: UserProfile, 
    transactions: Transaction[]
): FinancialMetrics {
    const monthlyIncome = userProfile.annualIncome / 12;
    const monthlyExpenses = userProfile.monthlyExpenses;
    
    // Margin: (Income - Expenses) / Income
    const margin = monthlyIncome > 0 
        ? Math.max(0, (monthlyIncome - monthlyExpenses) / monthlyIncome)
        : 0;
    
    // Liquidity Ratio: Current Balance / Monthly Expenses
    const liquidityRatio = monthlyExpenses > 0 
        ? userProfile.currentBalance / monthlyExpenses
        : 0;
    
    // Expense Revenue Ratio: Expenses / Income
    const expenseRevenueRatio = monthlyIncome > 0 
        ? monthlyExpenses / monthlyIncome
        : 1;
    
    // Operational Leverage: Simplified as inverse of margin stability
    const operationalLeverage = 0.3; // Default moderate leverage
    
    return {
        margin,
        liquidityRatio,
        expenseRevenueRatio,
        operationalLeverage
    };
}

/**
 * Calculate forecast summary using existing forecast function
 */
function calculateForecast(
    transactions: Transaction[], 
    currentBalance: number
): ForecastSummary {
    // Extract daily revenue and expenses from last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentTx = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
    
    // Group by date and calculate daily totals
    const dailyData: Record<string, { income: number; expense: number }> = {};
    
    for (let i = 0; i < 30; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        dailyData[dateStr] = { income: 0, expense: 0 };
    }
    
    recentTx.forEach(tx => {
        const dateStr = tx.date;
        if (dailyData[dateStr]) {
            if (tx.type === 'income') {
                dailyData[dateStr].income += tx.amount;
            } else {
                dailyData[dateStr].expense += tx.amount;
            }
        }
    });
    
    const dailyRevenue = Object.values(dailyData).map(d => d.income);
    const dailyExpenses = Object.values(dailyData).map(d => d.expense);
    
    const forecastInput: ForecastInput = {
        dailyRevenue,
        dailyExpenses,
        currentCash: currentBalance
    };
    
    const result = generateForecast(forecastInput, 30);
    
    // Determine trend
    const avgNetFlow = (dailyRevenue.reduce((a, b) => a + b, 0) - 
                        dailyExpenses.reduce((a, b) => a + b, 0)) / 30;
    
    let trend: 'positive' | 'negative' | 'stable' = 'stable';
    if (avgNetFlow > 100) trend = 'positive';
    else if (avgNetFlow < -100) trend = 'negative';
    
    return {
        safeDays: result.safeDays,
        dailySaveTarget: Math.round(result.dailySaveTarget),
        trend,
        baseEndBalance: Math.round(result.base[result.base.length - 1] || currentBalance),
        stressedEndBalance: Math.round(result.stressed[result.stressed.length - 1] || currentBalance)
    };
}

/**
 * Calculate goal progress from user goals
 */
function calculateGoalProgress(goals: Goal[]): GoalProgress[] {
    return goals.map(goal => ({
        id: goal.id,
        title: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        progressPercent: goal.targetAmount > 0 
            ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
            : 0,
        deadline: goal.deadline,
        priority: goal.priority,
        category: goal.category
    }));
}

/**
 * Calculate aggregate goal progress
 */
function calculateTotalGoalProgress(goals: GoalProgress[]): number {
    if (goals.length === 0) return 0;
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    return totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;
}

/**
 * Calculate recent transaction activity
 */
function calculateRecentActivity(recentTransactions: Transaction[]): TransactionSummary {
    const income = recentTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = recentTransactions
        .filter(t => t.type === 'expense' || t.type === 'withdrawal')
        .reduce((sum, t) => sum + t.amount, 0);
    
    // Find top expense category
    const expensesByCategory: Record<string, number> = {};
    recentTransactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        });
    
    let topExpenseCategory = 'None';
    let topExpenseAmount = 0;
    
    Object.entries(expensesByCategory).forEach(([category, amount]) => {
        if (amount > topExpenseAmount) {
            topExpenseCategory = category;
            topExpenseAmount = amount;
        }
    });
    
    return {
        totalIncome7Days: income,
        totalExpenses7Days: expenses,
        netFlow7Days: income - expenses,
        topExpenseCategory,
        topExpenseAmount,
        transactionCount7Days: recentTransactions.length
    };
}

/**
 * Determine overall financial status based on multiple signals
 * 
 * IMPORTANT: This is a simple aggregation of existing ML outputs.
 * It does NOT replace or modify any existing ML logic.
 */
function determineFinancialStatus(
    gigLensScore: number,
    karmaScore: number,
    creditScore: number,
    safeDays: number,
    leakCount: number
): { status: FinancialStatus; reason: string } {
    
    // Weight the signals
    const signals = {
        gigLensGood: gigLensScore >= 60,
        karmaGood: karmaScore >= 60,
        creditGood: creditScore >= 650,
        runwayGood: safeDays >= 14,
        noMajorLeaks: leakCount <= 1
    };
    
    const positiveSignals = Object.values(signals).filter(Boolean).length;
    
    if (positiveSignals >= 4) {
        return {
            status: 'healthy',
            reason: 'Your scores are strong and cash flow looks stable.'
        };
    } else if (positiveSignals >= 2) {
        // Determine specific reason
        let reason = 'Some areas need attention.';
        if (!signals.runwayGood) {
            reason = 'Your cash runway is shorter than recommended.';
        } else if (!signals.karmaGood) {
            reason = 'Your work consistency could be improved.';
        } else if (!signals.noMajorLeaks) {
            reason = 'Detected some expense leaks to review.';
        }
        return { status: 'moderate', reason };
    } else {
        let reason = 'Multiple areas need immediate attention.';
        if (safeDays < 7) {
            reason = 'Your cash runway is critically low.';
        } else if (creditScore < 500) {
            reason = 'Your credit score needs improvement.';
        } else if (leakCount > 2) {
            reason = 'High expense leaks detected.';
        }
        return { status: 'risky', reason };
    }
}

/**
 * Parse approval probability from string format
 */
function parseApprovalProbability(value: string | number): number {
    if (typeof value === 'number') return value;
    if (value === 'High') return 0.8;
    if (value === 'Medium') return 0.6;
    if (value === 'Low') return 0.3;
    if (value.includes('%')) return parseFloat(value) / 100;
    return 0.5;
}

/**
 * Create a minimal data object when full data is not available
 * Used before onboarding is complete
 */
export function createMinimalVoiceAgentData(): BackendFinancialData {
    return {
        userName: 'User',
        currentBalance: 0,
        annualIncome: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        gigCreditScore: 0,
        approvalProbability: 0,
        maxLoanAmount: 0,
        karmaScore: 0,
        gigLensScore: 0,
        streak: 0,
        level: 'Rookie',
        levelProgress: 0,
        overallStatus: 'unknown',
        statusReason: 'Complete onboarding to see your financial status.',
        detectedLeaks: [],
        totalLeakAmount: 0,
        goals: [],
        totalGoalProgress: 0,
        forecast: {
            safeDays: 0,
            dailySaveTarget: 0,
            trend: 'stable',
            baseEndBalance: 0,
            stressedEndBalance: 0
        },
        recentActivity: {
            totalIncome7Days: 0,
            totalExpenses7Days: 0,
            netFlow7Days: 0,
            topExpenseCategory: 'None',
            topExpenseAmount: 0,
            transactionCount7Days: 0
        },
        dataTimestamp: new Date().toISOString(),
        hasCompleteData: false
    };
}
