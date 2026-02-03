import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface PredictionData {
    annual_income: number;
    incentives: number;
    platform_commission: number;
    total_expenses: number;
    weekly_work_hours: number;
    orders_per_month: number;
    debt_amount: number;
    savings_rate: number;
}

export interface PredictionResponse {
    predictions: {
        gig_credit_score: number;
        approval_probability?: number | string;
        max_loan_amount?: number;
        [key: string]: any;
    };
    message: string;
}

export const getGigWorkerPrediction = async (formData: PredictionData): Promise<PredictionResponse> => {
    try {
        const response = await axios.post(`${API_URL}/predict`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Prediction API Error:", error);
        throw error;
    }
};
