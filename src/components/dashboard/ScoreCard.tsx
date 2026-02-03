import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getScoreColor } from "@/lib/scoring";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
    score: number;
    segment: string;
    title?: string;
}

export function ScoreCard({ score, segment, title = "GigLens Score" }: ScoreCardProps) {
    const colorClass = getScoreColor(score);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn("text-4xl font-bold", colorClass)}>
                    {score}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {segment}
                    {score !== 650 && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            ML Verified ✓
                        </span>
                    )}
                </p>
                <div className="mt-4 h-2 w-full rounded-full bg-secondary">
                    <div
                        className={cn("h-2 rounded-full transition-all", score >= 80 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500")}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
