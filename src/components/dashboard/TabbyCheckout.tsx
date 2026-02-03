"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, CreditCard, Calendar } from "lucide-react";
import { useGigFin } from "@/context/GigFinContext";

export function TabbyCheckout() {
    const { applyForLoan, loans } = useGigFin();
    const [amount, setAmount] = useState<number>(2000);

    const activeLoan = loans.find(l => l.status === 'active');

    const handleApply = () => {
        applyForLoan(amount);
    };

    if (activeLoan) {
        return (
            <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-purple-500" />
                        Gig-Tabby Active
                    </CardTitle>
                    <CardDescription>You have an active loan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Remaining</span>
                            <span className="text-xl font-bold">₹{activeLoan.remainingAmount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Next Installment</span>
                            <span className="font-medium">₹{activeLoan.installmentAmount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Due Date</span>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{activeLoan.nextDueDate}</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full" disabled>Pay Now (Coming Soon)</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    Gig-Tabby Pay Later
                </CardTitle>
                <CardDescription>Split expenses into 4 interest-free payments.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Loan Amount</label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min={500}
                            max={5000}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground">Min: ₹500, Max: ₹5000</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Today</span>
                        <span className="font-bold">₹0</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Next 4 Weeks</span>
                        <span>4 x ₹{amount / 4}</span>
                    </div>
                </div>

                <Button onClick={handleApply} className="w-full bg-purple-600 hover:bg-purple-700">
                    Get ₹{amount} Now
                </Button>
            </CardContent>
        </Card>
    );
}
