// import { FinancialSnapshot, Recommendations, Forecast, User } from "@prisma/client";

// --- Interfaces (Defined locally to avoid Prisma dependency issues in dev) ---

export interface User {
    id: string;
    name: string | null;
    email: string;
    role: string;
    image: string | null;
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: "income" | "expense";
}

export interface FinancialSnapshot {
    id: string;
    userId: string;
    sector: string | null;
    stage: string | null;
    revenue: number;
    expenses: number;
    ebitda: number;
    growth: number;
    customers: number;
    rate: number;
    months: number;
    margin: number;
    liquidityRatio: number;
    createdAt: Date;
}

export interface Recommendations {
    id: string;
    userId: string;
    segment: string;
    score: number;
    leakAreas: any;
    safeEmi: number;
    suggestedBudget: number;
    createdAt: Date;
}

export interface Forecast {
    id: string;
    userId: string;
    baseForecast: any;
    optimisticForecast: any;
    stressedForecast: any;
    safeDays: number;
    dailySaveTarget: number;
    createdAt: Date;
}

export interface DashboardData {
    user: Partial<User>;
    score: number;
    segment: string;
    revenue: number;
    expenseRatio: number;
    emiLoad: number;
    liquidityRatio: number;
    recentSnapshots: FinancialSnapshot[];
    transactions?: Transaction[];
}

export interface AnalysisResult {
    snapshot: FinancialSnapshot;
    recommendations: Recommendations;
    forecast: Forecast;
}

export interface ApiService {
    getDashboardData(userId: string): Promise<DashboardData>;
    uploadCsv(userId: string, file: File): Promise<AnalysisResult>;
    getForecast(userId: string): Promise<Forecast>;
}

// --- Mock Implementation (for now) ---

export const mockApiService: ApiService = {
    getDashboardData: async (userId: string) => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock Transactions for Gamification
        const today = new Date();
        const transactions: Transaction[] = [
            { id: "1", date: today.toISOString().split('T')[0], amount: 250, type: "income" },
            { id: "2", date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0], amount: 45, type: "expense" },
            { id: "3", date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0], amount: 300, type: "income" },
            { id: "4", date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0], amount: 200, type: "income" },
            { id: "5", date: new Date(today.setDate(today.getDate() - 2)).toISOString().split('T')[0], amount: 150, type: "income" },
        ];

        return {
            user: { name: "Demo User", email: "demo@giglens.com" },
            score: 78,
            segment: "Stable Compounding Earners",
            revenue: 45000,
            expenseRatio: 0.65,
            emiLoad: 15,
            liquidityRatio: 2.1,
            recentSnapshots: [],
            transactions: transactions,
        };
    },

    uploadCsv: async (userId: string, file: File) => {
        throw new Error("Not implemented yet");
    },

    getForecast: async (userId: string) => {
        throw new Error("Not implemented yet");
    }
};

// --- Factory ---

const useMock = true; // Force mock for now due to Prisma binary issues

export const api: ApiService = useMock ? mockApiService : mockApiService;
