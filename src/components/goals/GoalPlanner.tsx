"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Calendar, TrendingUp, AlertCircle, CheckCircle2, Calculator } from "lucide-react";
import { useGigFin, Goal } from "@/context/GigFinContext";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

export function GoalPlanner() {
    const { userProfile, updateUserProfile } = useGigFin();
    const [isAdding, setIsAdding] = useState(false);
    const [newGoal, setNewGoal] = useState<Partial<Goal>>({
        title: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: '',
        priority: 'Medium',
        category: 'Personal'
    });

    // Smart Calculator State
    const [calcAmount, setCalcAmount] = useState<number>(0);
    const [calcDeadline, setCalcDeadline] = useState<string>('');

    const handleAddGoal = () => {
        if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) return;

        const goal: Goal = {
            id: Date.now().toString(),
            title: newGoal.title,
            targetAmount: Number(newGoal.targetAmount),
            currentAmount: Number(newGoal.currentAmount) || 0,
            deadline: newGoal.deadline,
            priority: newGoal.priority as 'High' | 'Medium' | 'Low',
            category: newGoal.category as any
        };

        updateUserProfile({ goals: [...userProfile.goals, goal] });
        setIsAdding(false);
        setNewGoal({ title: '', targetAmount: 0, currentAmount: 0, deadline: '', priority: 'Medium', category: 'Personal' });
    };

    const handleDeleteGoal = (id: string) => {
        updateUserProfile({ goals: userProfile.goals.filter(g => g.id !== id) });
    };

    // Derived Metrics
    const totalTarget = userProfile.goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = userProfile.goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

    const pieData = userProfile.goals.map(g => ({
        name: g.title,
        value: g.currentAmount
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const calculateDailySavings = (target: number, current: number, deadlineStr: string) => {
        const deadline = new Date(deadlineStr);
        const today = new Date();
        const diffTime = Math.abs(deadline.getTime() - today.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return 0;
        const remaining = target - current;
        return remaining > 0 ? Math.round(remaining / diffDays) : 0;
    };

    const smartCalcResult = useMemo(() => {
        if (!calcAmount || !calcDeadline) return null;
        return calculateDailySavings(calcAmount, 0, calcDeadline);
    }, [calcAmount, calcDeadline]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Goal Planner</h2>
                    <p className="text-muted-foreground">Track, plan, and achieve your financial dreams.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} className="gap-2">
                    <Plus className="h-4 w-4" /> {isAdding ? 'Cancel' : 'Add New Goal'}
                </Button>
            </div>

            {/* Add Goal Form */}
            {isAdding && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg">Create New Goal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Goal Title</label>
                                <Input
                                    placeholder="e.g. New Bike"
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Target Amount (₹)</label>
                                <Input
                                    type="number"
                                    placeholder="50000"
                                    value={newGoal.targetAmount || ''}
                                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Deadline</label>
                                <Input
                                    type="date"
                                    value={newGoal.deadline}
                                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select
                                    value={newGoal.category}
                                    onValueChange={(val: any) => setNewGoal({ ...newGoal, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Personal">Personal</SelectItem>
                                        <SelectItem value="Emergency">Emergency</SelectItem>
                                        <SelectItem value="Work">Work</SelectItem>
                                        <SelectItem value="Travel">Travel</SelectItem>
                                        <SelectItem value="Gadget">Gadget</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <Select
                                    value={newGoal.priority}
                                    onValueChange={(val: any) => setNewGoal({ ...newGoal, priority: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button className="w-full" onClick={handleAddGoal}>Save Goal</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Goals List */}
                <div className="lg:col-span-2 space-y-4">
                    {userProfile.goals.map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const dailyNeeded = calculateDailySavings(goal.targetAmount, goal.currentAmount, goal.deadline);
                        const isCompleted = progress >= 100;

                        return (
                            <Card key={goal.id} className={cn("transition-all hover:shadow-md", isCompleted ? "border-green-500/50 bg-green-50/10" : "")}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">{goal.title}</h3>
                                                <Badge variant={goal.priority === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                                                    {goal.priority}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">{goal.category}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> Due: {new Date(goal.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">₹{goal.currentAmount.toLocaleString()} <span className="text-sm text-muted-foreground font-normal">/ {goal.targetAmount.toLocaleString()}</span></p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className={cn("font-medium", isCompleted ? "text-green-600" : "text-primary")}>
                                                {isCompleted ? "Goal Achieved! 🎉" : `${Math.round(progress)}% Completed`}
                                            </span>
                                            {!isCompleted && (
                                                <span className="text-muted-foreground">
                                                    Save <span className="font-bold text-foreground">₹{dailyNeeded}</span> / day
                                                </span>
                                            )}
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>

                                    <div className="mt-4 flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteGoal(goal.id)}>Delete</Button>
                                        <Button variant="outline" size="sm">Add Funds</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {userProfile.goals.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <h3 className="text-lg font-medium">No Goals Yet</h3>
                            <p className="text-muted-foreground mb-4">Start planning your financial future today.</p>
                            <Button onClick={() => setIsAdding(true)}>Create First Goal</Button>
                        </div>
                    )}
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    {/* Overall Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-green-500" />
                                Portfolio Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center mb-6">
                                <p className="text-sm text-muted-foreground">Total Saved</p>
                                <p className="text-4xl font-bold text-primary">₹{totalSaved.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground mt-1">Target: ₹{totalTarget.toLocaleString()}</p>
                            </div>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Smart Calculator */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Calculator className="h-4 w-4" />
                                Quick Calculator
                            </CardTitle>
                            <CardDescription>How much do I need to save?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium">I want to save (₹)</label>
                                <Input
                                    type="number"
                                    value={calcAmount || ''}
                                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                                    className="bg-background"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium">By Date</label>
                                <Input
                                    type="date"
                                    value={calcDeadline}
                                    onChange={(e) => setCalcDeadline(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                            {smartCalcResult !== null && (
                                <div className="rounded-md bg-background p-3 text-center border">
                                    <p className="text-xs text-muted-foreground">You need to save</p>
                                    <p className="text-xl font-bold text-primary">₹{smartCalcResult}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
