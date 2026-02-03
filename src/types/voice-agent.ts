/**
 * Voice Agent Types
 * 
 * Structured data types for the data-aware voice agent.
 * The LLM receives this pre-computed data and can ONLY explain it.
 * The LLM must NEVER compute, predict, or invent any values.
 */

// Financial status derived from backend ML
export type FinancialStatus = 'healthy' | 'moderate' | 'risky' | 'unknown';

// Risk level for detected leaks
export type RiskLevel = 'High' | 'Medium' | 'Low';

// Leak types detected by ML simulation
export type LeakType = 'Fuel Spike' | 'Hidden Fee' | 'Subscription' | 'High Expense';

// User level based on streak
export type UserLevel = 'Rookie' | 'Pro Driver' | 'Master Fleet';

/**
 * Detected financial leak from ML simulation
 */
export interface DetectedLeak {
    id: string;
    type: LeakType;
    amount: number;
    risk: RiskLevel;
}

/**
 * Goal progress information
 */
export interface GoalProgress {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    progressPercent: number;
    deadline: string;
    priority: 'High' | 'Medium' | 'Low';
    category: string;
}

/**
 * Cash flow forecast from ML
 */
export interface ForecastSummary {
    safeDays: number;              // Days until cash < 0 in stressed scenario
    dailySaveTarget: number;       // Recommended daily savings
    trend: 'positive' | 'negative' | 'stable';
    baseEndBalance: number;        // Projected balance in 30 days (base case)
    stressedEndBalance: number;    // Projected balance in 30 days (stressed case)
}

/**
 * Recent transaction summary
 */
export interface TransactionSummary {
    totalIncome7Days: number;
    totalExpenses7Days: number;
    netFlow7Days: number;
    topExpenseCategory: string;
    topExpenseAmount: number;
    transactionCount7Days: number;
}

/**
 * Complete structured backend data for voice agent
 * 
 * CRITICAL: All values here are PRE-COMPUTED by backend/ML.
 * The LLM must only EXPLAIN these values, never calculate new ones.
 */
export interface BackendFinancialData {
    // User identification
    userName: string;
    
    // Core financial metrics (from GigFinContext)
    currentBalance: number;
    annualIncome: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    
    // ML-predicted scores (from backend /predict API)
    gigCreditScore: number;           // 300-900 scale
    approvalProbability: number;      // 0-1 scale
    maxLoanAmount: number;
    
    // Computed scores (from frontend ML functions)
    karmaScore: number;               // 0-100, work consistency
    gigLensScore: number;             // 0-100, overall financial health
    
    // Gamification (from lib/gamification.ts)
    streak: number;                   // Consecutive active days
    level: UserLevel;                 // Rookie, Pro Driver, Master Fleet
    levelProgress: number;            // 0-100 progress to next level
    
    // Financial status (derived from scores)
    overallStatus: FinancialStatus;
    statusReason: string;             // Human-readable reason
    
    // Leak detection (from useMLSimulation)
    detectedLeaks: DetectedLeak[];
    totalLeakAmount: number;
    
    // Goals (from GigFinContext)
    goals: GoalProgress[];
    totalGoalProgress: number;        // 0-100 aggregate
    
    // Cash flow forecast (from lib/forecast.ts)
    forecast: ForecastSummary;
    
    // Recent activity (computed from transactions)
    recentActivity: TransactionSummary;
    
    // Metadata
    dataTimestamp: string;            // ISO timestamp when data was aggregated
    hasCompleteData: boolean;         // False if any critical data is missing
}

/**
 * Voice agent API request payload
 */
export interface VoiceAgentRequest {
    message: string;
    language: 'en' | 'hi' | 'te';
    backendData: BackendFinancialData;
}

/**
 * Voice agent API response
 */
export interface VoiceAgentResponse {
    response: string;
    source: 'groq' | 'fallback';
    model?: string;
    error?: string;
    dataUsed?: boolean;  // Whether response was grounded in backend data
}
