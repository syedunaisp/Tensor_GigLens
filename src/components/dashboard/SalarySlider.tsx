"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2, CheckCircle, Lock } from "lucide-react";
import { useGigFin } from "@/context/GigFinContext";

export function SalarySlider() {
    const { userProfile, withdrawMoney, calculateKarmaScore } = useGigFin();
    const [amount, setAmount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const karmaScore = calculateKarmaScore();
    const isUnlocked = karmaScore >= 60;
    const maxWithdrawal = Math.floor(userProfile.currentBalance * 0.60); // 60% of balance

    const handleWithdraw = async () => {
        if (amount <= 0) return;

        setIsProcessing(true);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const result = withdrawMoney(amount);

        setIsProcessing(false);

        if (result.success) {
            setSuccessMessage(`₹${amount} sent to ${userProfile.bankDetails.bankName} (A/c ...${userProfile.bankDetails.accountNo.slice(-4)})`);
            setShowSuccess(true);
            setAmount(0);
        } else {
            alert(result.message);
        }
    };

    return (
        <>
            <Card className="border-none shadow-xl rounded-2xl border-t-4 border-green-500 bg-white dark:bg-slate-900">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Withdraw Salary (वेतन निकालें)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Available to Withdraw</span>
                        <span className="text-2xl font-bold text-green-700 dark:text-green-400">₹{maxWithdrawal}</span>
                    </div>

                    {isUnlocked ? (
                        <>
                            <div className="space-y-2">
                                <Slider
                                    value={[amount]}
                                    max={maxWithdrawal}
                                    step={100}
                                    onValueChange={(vals) => setAmount(vals[0])}
                                    className="py-2"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>₹0</span>
                                    <span className="font-bold text-primary">Selected: ₹{amount}</span>
                                    <span>₹{maxWithdrawal}</span>
                                </div>
                            </div>
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                onClick={handleWithdraw}
                                disabled={amount === 0 || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Withdraw Now"
                                )}
                            </Button>
                        </>
                    ) : (
                        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-center space-y-2">
                            <Lock className="h-6 w-6 mx-auto text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">Boost Score to 60 to Unlock</p>
                            <Button variant="outline" size="sm" disabled className="w-full opacity-50">
                                Locked
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-6 w-6" />
                            Transfer Successful
                        </DialogTitle>
                        <DialogDescription>
                            {successMessage}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowSuccess(false)}>Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
