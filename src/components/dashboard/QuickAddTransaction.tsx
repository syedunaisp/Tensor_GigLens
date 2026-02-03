"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGigFin } from "@/context/GigFinContext"; // Assume this context exists
import { PlusCircle, MinusCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function QuickAddTransaction() {
    const { addTransaction } = useGigFin();
    const { t } = useLanguage();
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = () => {
        if (!amount || !category) return;

        addTransaction({
            type,
            amount: Number(amount),
            category,
            date: new Date().toISOString().split('T')[0],
            description: type === 'income' ? 'Manual Income' : 'Manual Expense'
        });

        // Reset
        setAmount("");
        setCategory("");
    };

    return (
        <Card className="border-none shadow-md">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{t.quick_add}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Button
                        variant={type === 'income' ? 'default' : 'ghost'}
                        className={`flex-1 ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => setType('income')}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t.btn_income}
                    </Button>
                    <Button
                        variant={type === 'expense' ? 'default' : 'ghost'}
                        className={`flex-1 ${type === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                        onClick={() => setType('expense')}
                    >
                        <MinusCircle className="mr-2 h-4 w-4" />
                        {t.btn_expense}
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label>{t.label_amount}</Label>
                    <Input
                        type="number"
                        placeholder={t.ph_amount}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>{t.label_category}</Label>
                    <Select onValueChange={setCategory} value={category}>
                        <SelectTrigger>
                            <SelectValue placeholder={t.ph_category} />
                        </SelectTrigger>
                        <SelectContent>
                            {/* In a real app, these options would also be translated or dynamic */}
                            <SelectItem value="Food">Food / भोजन</SelectItem>
                            <SelectItem value="Fuel">Fuel / ईंधन</SelectItem>
                            <SelectItem value="Maintenance">Maintenance / मरम्मत</SelectItem>
                            <SelectItem value="Uber Payout">Income / आय</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button className="w-full" onClick={handleSubmit}>
                    {t.btn_submit}
                </Button>
            </CardContent>
        </Card>
    );
}
