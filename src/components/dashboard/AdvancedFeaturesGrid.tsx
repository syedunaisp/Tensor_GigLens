"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Bot, AlertTriangle, Activity, Zap } from "lucide-react";
import { useMLSimulation } from "@/hooks/useMLSimulation";
import { useGigFin } from "@/context/GigFinContext";
import { cn } from "@/lib/utils";

interface AdvancedFeaturesGridProps {
    title?: string;
}

export function AdvancedFeaturesGrid({ title = "AI Financial Scientist" }: AdvancedFeaturesGridProps) {
    const { appConfig, updateAppConfig, userProfile, transactions } = useGigFin();
    const { autoPilotStatus, toggleAutoPilot, detectedLeaks } = useMLSimulation(
        transactions,
        userProfile.currentBalance,
        userProfile.goals
    );

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary" />
                {title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. GigLens Autopilot */}
                <Card className="border-l-4 border-l-primary bg-gradient-to-br from-card to-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">GigLens Autopilot</CardTitle>
                        <Zap className={cn("h-4 w-4", autoPilotStatus ? "text-green-500 fill-green-500 animate-pulse" : "text-muted-foreground")} />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <div className="flex items-center gap-2">
                                <span className={cn("text-sm font-bold", autoPilotStatus ? "text-green-600" : "text-muted-foreground")}>
                                    {autoPilotStatus ? "Active" : "Paused"}
                                </span>
                                <Switch checked={autoPilotStatus} onCheckedChange={toggleAutoPilot} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">Ingestion Sources</p>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors">WhatsApp</Badge>
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors">SMS</Badge>
                                <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-colors">Uber API</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Invisible-Leak Scanner */}
                <Card className="border-l-4 border-l-destructive bg-gradient-to-br from-card to-destructive/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Invisible-Leak Scanner</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive animate-bounce" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {detectedLeaks.length > 0 ? detectedLeaks.map((leak) => (
                                <div key={leak.id} className="flex items-center justify-between rounded-md border bg-background/50 p-2 shadow-sm">
                                    <div>
                                        <p className="text-sm font-medium">{leak.type}</p>
                                        <p className="text-xs text-destructive font-bold">{leak.risk} Risk</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-destructive">-₹{leak.amount.toFixed(0)}</p>
                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                                            Investigate
                                        </Button>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-4 text-muted-foreground">
                                    <p className="text-sm">No leaks detected!</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>




            </div>
        </div>
    );
}
