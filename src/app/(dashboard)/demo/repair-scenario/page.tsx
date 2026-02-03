"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Smartphone, Wrench, CreditCard, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RepairScenarioPage() {
    const [stage, setStage] = useState<'emergency' | 'analyzing' | 'approved' | 'success'>('emergency');
    const [loadingText, setLoadingText] = useState("Connecting to Swiggy/Zomato APIs...");
    const [showConfetti, setShowConfetti] = useState(false);

    // Loading Animation Logic
    useEffect(() => {
        if (stage === 'analyzing') {
            const texts = [
                "Connecting to Swiggy/Zomato APIs...",
                "Analyzing Last 7 Days Earnings...",
                "Calculating Fuel Burn Rate...",
                "Verifying Location Consistency..."
            ];
            let index = 0;

            const textInterval = setInterval(() => {
                index = (index + 1) % texts.length;
                setLoadingText(texts[index]);
            }, 800);

            const timeout = setTimeout(() => {
                setStage('approved');
            }, 3500);

            return () => {
                clearInterval(textInterval);
                clearTimeout(timeout);
            };
        }
    }, [stage]);

    const handlePayNow = () => {
        setStage('success');
        setShowConfetti(true);
        // Reset confetti after animation
        setTimeout(() => setShowConfetti(false), 3000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[100px]" />
            </div>

            {/* Confetti Effect (CSS only) */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
                    <div className="animate-ping absolute h-full w-full bg-green-500/20 opacity-0" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce">
                        🎉
                    </div>
                </div>
            )}

            <div className="max-w-md w-full relative z-10">
                {/* STAGE 1: THE EMERGENCY */}
                {stage === 'emergency' && (
                    <Card className="border-red-500/30 bg-slate-900/80 backdrop-blur-md shadow-2xl shadow-red-900/20 animate-in fade-in zoom-in duration-500">
                        <div className="relative h-48 bg-slate-800 rounded-t-lg overflow-hidden group">
                            {/* Placeholder for Hero Bike Image - using a gradient/icon fallback if no image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                <Wrench className="h-24 w-24 text-slate-700 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="absolute inset-0 bg-red-500/10" />
                            <div className="absolute top-4 right-4 animate-pulse">
                                <div className="bg-red-600 text-white p-2 rounded-full shadow-lg shadow-red-600/40">
                                    <AlertTriangle className="h-8 w-8" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900 to-transparent p-4">
                                <Badge variant="destructive" className="mb-2 animate-pulse">CRITICAL FAILURE</Badge>
                            </div>
                        </div>

                        <CardHeader>
                            <CardTitle className="text-2xl text-red-500 flex items-center gap-2">
                                Rear Tyre Burst
                            </CardTitle>
                            <CardDescription className="text-slate-400 text-base">
                                Vehicle grounded. Daily income at risk.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <span className="text-red-200 font-medium">Estimated Repair Cost</span>
                                <span className="text-2xl font-bold text-red-500">₹1,200</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-950/50 p-3 rounded-lg">
                                <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />
                                <span>Wallet Balance: <span className="text-red-400 font-bold">₹150</span> (Insufficient)</span>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                size="lg"
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
                                onClick={() => setStage('analyzing')}
                            >
                                <ZapIcon className="mr-2 h-5 w-5 fill-current" />
                                Pay with Gig-Tabby
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* STAGE 2: AI ANALYSIS */}
                {stage === 'analyzing' && (
                    <Card className="border-blue-500/30 bg-slate-900/80 backdrop-blur-md shadow-2xl shadow-blue-900/20 animate-in fade-in zoom-in duration-500 min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                            <Loader2 className="h-16 w-16 text-blue-500 animate-spin relative z-10" />
                        </div>

                        <h3 className="text-xl font-bold text-blue-400 mb-2">AI Credit Analysis</h3>
                        <p className="text-slate-300 animate-pulse transition-all duration-300 min-h-[24px]">
                            {loadingText}
                        </p>

                        <div className="mt-8 w-full space-y-2">
                            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 animate-[progress_3.5s_ease-in-out_forwards] w-0" />
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                                <span>Initiating</span>
                                <span>Verifying</span>
                                <span>Approving</span>
                            </div>
                        </div>
                    </Card>
                )}

                {/* STAGE 3: APPROVAL & SLICE */}
                {stage === 'approved' && (
                    <Card className="border-green-500/30 bg-slate-900/80 backdrop-blur-md shadow-2xl shadow-green-900/20 animate-in fade-in zoom-in duration-500">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400" />

                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto bg-green-500/10 p-3 rounded-full w-fit mb-4 border border-green-500/20">
                                <ShieldCheck className="h-8 w-8 text-green-500" />
                            </div>
                            <CardTitle className="text-2xl text-green-400">Request Approved!</CardTitle>
                            <CardDescription className="text-slate-400">
                                Credit Limit Unlocked: <span className="text-white font-bold">₹5,000</span>
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-400 text-sm">Total Bill</span>
                                    <span className="text-xl font-bold text-white">₹1,200</span>
                                </div>

                                <div className="space-y-3 relative">
                                    {/* Connecting Line */}
                                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-800 -z-10" />

                                    {/* Payment Steps */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center shrink-0">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div className="flex-1 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-green-400">Pay Today</p>
                                                <p className="text-xs text-slate-500">Covered by Gig-Tabby</p>
                                            </div>
                                            <span className="font-bold text-white">₹300</span>
                                        </div>
                                    </div>

                                    {[1, 2, 3].map((week) => (
                                        <div key={week} className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-xs text-slate-400 font-mono">
                                                W{week}
                                            </div>
                                            <div className="flex-1 flex justify-between items-center opacity-70">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-300">Week {week}</p>
                                                    <p className="text-xs text-slate-500">Auto-deduct</p>
                                                </div>
                                                <span className="font-medium text-slate-300">₹300</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button
                                size="lg"
                                className="w-full bg-green-600 hover:bg-green-500 text-white font-bold text-lg shadow-lg shadow-green-600/20 transition-all hover:scale-[1.02]"
                                onClick={handlePayNow}
                            >
                                Pay Mechanic Now
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* STAGE 4: SUCCESS */}
                {stage === 'success' && (
                    <Card className="border-green-500/30 bg-slate-900/80 backdrop-blur-md shadow-2xl shadow-green-900/20 animate-in fade-in zoom-in duration-500 text-center p-8">
                        <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit mb-6 border border-green-500/20 animate-bounce">
                            <Smartphone className="h-10 w-10 text-green-500" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                        <p className="text-slate-400 mb-8">
                            ₹1,200 sent to <span className="text-white font-semibold">Raju Garage</span>.
                        </p>

                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex items-start gap-3 text-left max-w-sm mx-auto">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white font-bold">
                                G
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Messages • Now</p>
                                <p className="text-sm text-slate-300">
                                    Your bike is ready! Payment of ₹1,200 received via GigFin. Drive safe! 🛵
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            className="mt-8 text-slate-400 hover:text-white"
                            onClick={() => setStage('emergency')}
                        >
                            Reset Demo
                        </Button>
                    </Card>
                )}
            </div>

            <style jsx global>{`
                @keyframes progress {
                    0% { width: 0% }
                    100% { width: 100% }
                }
            `}</style>
        </div>
    );
}

function ZapIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    )
}
