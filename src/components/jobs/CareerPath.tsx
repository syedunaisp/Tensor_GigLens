"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock, TrendingUp, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface CareerStep {
    id: string;
    title: string;
    salary: string;
    status: 'current' | 'locked' | 'completed';
    requirements: {
        label: string;
        current: number;
        target: number;
    }[];
}

const CAREER_PATH: CareerStep[] = [
    {
        id: '1',
        title: 'Gig Rider',
        salary: '₹15k - ₹25k',
        status: 'current',
        requirements: [
            { label: 'Consistency', current: 85, target: 90 },
            { label: 'Rating', current: 4.5, target: 4.8 }
        ]
    },
    {
        id: '2',
        title: 'Team Lead',
        salary: '₹30k - ₹40k',
        status: 'locked',
        requirements: [
            { label: 'Experience', current: 6, target: 12 }, // months
            { label: 'Leadership Score', current: 40, target: 80 }
        ]
    },
    {
        id: '3',
        title: 'Fleet Manager',
        salary: '₹50k+',
        status: 'locked',
        requirements: []
    }
];

export function CareerPath() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">Your Career Ladder</h3>
            </div>

            <div className="relative space-y-8 pl-4 before:absolute before:left-[19px] before:top-4 before:h-[85%] before:w-0.5 before:bg-border">
                {CAREER_PATH.map((step, index) => (
                    <div key={step.id} className="relative pl-8">
                        {/* Timeline Dot */}
                        <div className={cn(
                            "absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background shadow-sm",
                            step.status === 'current' ? "bg-primary text-primary-foreground" :
                                step.status === 'completed' ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                        )}>
                            {step.status === 'locked' ? <Lock className="h-4 w-4" /> :
                                step.status === 'current' ? <Award className="h-5 w-5" /> : <Unlock className="h-4 w-4" />}
                        </div>

                        <Card className={cn(
                            "transition-all",
                            step.status === 'current' ? "border-primary shadow-md ring-1 ring-primary/20" : "opacity-80"
                        )}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-base font-bold">{step.title}</CardTitle>
                                    <span className="text-sm font-medium text-muted-foreground">{step.salary}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                                {step.status === 'current' ? (
                                    <div className="space-y-3">
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Unlock Next Level</p>
                                        {step.requirements.map((req, i) => (
                                            <div key={i} className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span>{req.label}</span>
                                                    <span className="font-bold">{req.current}/{req.target}</span>
                                                </div>
                                                <Progress value={(req.current / req.target) * 100} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                ) : step.status === 'locked' ? (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                                        <Lock className="h-4 w-4" />
                                        Complete previous level to unlock
                                    </div>
                                ) : (
                                    <div className="text-sm text-green-600 font-medium">Completed</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
