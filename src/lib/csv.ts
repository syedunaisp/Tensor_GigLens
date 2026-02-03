import Papa from "papaparse";

export interface CsvRow {
    Date: string;
    Description: string;
    Category: string; // "Revenue" or "Expense"
    Amount: string; // "1200.00"
}

export interface ParsedData {
    rows: CsvRow[];
    totalRevenue: number;
    totalExpenses: number;
    transactions: { date: string; amount: number; type: "income" | "expense" }[];
}

export async function parseCsv(file: File): Promise<ParsedData> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data as CsvRow[];
                let totalRevenue = 0;
                let totalExpenses = 0;
                const transactions: any[] = [];

                rows.forEach(row => {
                    const amount = parseFloat(row.Amount);
                    if (isNaN(amount)) return;

                    if (row.Category?.toLowerCase() === "revenue" || row.Category?.toLowerCase() === "income") {
                        totalRevenue += amount;
                        transactions.push({ date: row.Date, amount, type: "income" });
                    } else {
                        totalExpenses += amount;
                        transactions.push({ date: row.Date, amount, type: "expense" });
                    }
                });

                resolve({ rows, totalRevenue, totalExpenses, transactions });
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}
