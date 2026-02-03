"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import VoiceAgent from "@/components/VoiceAgent";
import { Activity, Shield, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
    const router = useRouter();
    const { language, toggleLanguage, setLanguage, t } = useLanguage();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col font-sans">
            {/* Navbar */}
            <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            <Activity className="inline-block h-6 w-6 mr-2 text-orange-600" />
                            GigLens
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Link href="#features" className="hover:text-orange-600 transition-colors">Features</Link>
                        <Link href="#how-it-works" className="hover:text-orange-600 transition-colors">How it Works</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {/* Simple Language Toggle */}
                        <Button variant="outline" size="sm" onClick={toggleLanguage} className="bg-orange-50 text-orange-700 border-orange-200">
                            {language === 'en' ? 'हिंदी | EN' : 'English | HI'}
                        </Button>

                        <Link href="/dashboard">
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="container mx-auto px-6 py-20 flex flex-col items-center text-center space-y-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl">
                        See Your Financial Future <span className="text-orange-600">Clearly</span>.
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                        A smart stability system for India's gig workforce. Understand earnings, detect leakage, and forecast cashflow with GigLens.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white min-w-[160px] h-12 text-lg">
                                Get Started <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/demo">
                            <Button size="lg" variant="outline" className="min-w-[160px] h-12 text-lg">
                                View Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Voice Agent - Integrated Centrally */}
                    <div className="w-full max-w-md mt-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">Or just ask GigLens</p>
                        <div className="flex justify-center">
                            <VoiceAgent variant="landing" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="container mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* GigLens Scorecard */}
                        <Card className="hover:shadow-lg transition-all hover:border-orange-200 group">
                            <CardContent className="p-8 space-y-4">
                                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">GigLens Scorecard</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Get a comprehensive financial health score based on margin, liquidity, and stability.
                                </p>
                            </CardContent>
                        </Card>

                        {/* LeakShield Guardrails */}
                        <Card className="hover:shadow-lg transition-all hover:border-orange-200 group">
                            <CardContent className="p-8 space-y-4">
                                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">LeakShield Guardrails</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Detect budget leaks and get smart alerts to stay within safe EMI limits.
                                </p>
                            </CardContent>
                        </Card>

                        {/* FlowForward */}
                        <Card className="hover:shadow-lg transition-all hover:border-orange-200 group">
                            <CardContent className="p-8 space-y-4">
                                <div className="h-12 w-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">FlowForward</h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Behavioral cashflow forecasting to predict safe days and savings targets.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t bg-slate-50 dark:bg-slate-950 py-12">
                <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
                    <p>© 2024 GigLens. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
