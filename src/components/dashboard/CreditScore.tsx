"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Lock, Unlock, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";
// import { useToast } from "@/components/ui/use-toast"; // Assuming you have a toast hook, or use alert

interface CreditScoreProps {
    score: number;
    title?: string;
}

export function CreditScore({ score, title = "Emergency Support" }: CreditScoreProps) {
    // const { toast } = useToast(); // If shadcn toast is installed

    const isEligible = score >= 650;
    const percentage = ((score - 300) / (850 - 300)) * 100;

    const handleDownload = () => {
        // Create a placeholder PDF blob
        const pdfContent = "%PDF-1.4\n%âãÏÓ\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Proof of Income Placeholder) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000117 00000 n\n0000000224 00000 n\n0000000312 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n406\n%%EOF";
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Proof_of_Income.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <Card className="overflow-hidden border-none shadow-xl rounded-2xl border-t-4 border-blue-600 bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xl font-bold text-gray-800 dark:text-white">
                    <span className="flex items-center gap-2">
                        <Handshake className="h-6 w-6 text-blue-600" />
                        {title}
                    </span>
                    {isEligible ? (
                        <Unlock className="h-5 w-5 text-green-500" />
                    ) : (
                        <Lock className="h-5 w-5 text-slate-400" />
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center space-y-4">
                    {/* Gauge Visualization */}
                    <div className="relative flex h-32 w-64 items-end justify-center overflow-hidden">
                        {/* Background Arch */}
                        <div className="absolute top-0 h-32 w-64 rounded-t-full bg-slate-700/50" />
                        {/* Active Arch */}
                        <div
                            className="absolute top-0 h-32 w-64 origin-bottom rounded-t-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-transform duration-1000 ease-out"
                            style={{
                                transform: `rotate(${percentage * 1.8 - 180}deg)`,
                            }}
                        />
                        {/* Inner Cover to make it an arc */}
                        <div className="absolute -bottom-1 z-10 flex h-24 w-48 items-end justify-center rounded-t-full bg-white dark:bg-slate-900">
                            <span className="mb-2 text-5xl font-bold text-gray-800 dark:text-white">{score}</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                            {isEligible
                                ? "🎉 You can get ₹50,000 Support!"
                                : "Increase work to unlock Support."}
                        </p>
                    </div>

                    <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="w-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Income Proof (आय प्रमाण)
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
