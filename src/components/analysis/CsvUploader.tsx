"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CsvUploaderProps {
    onUpload: (file: File) => void;
}

export function CsvUploader({ onUpload }: CsvUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
                setFile(droppedFile);
            }
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (file) {
            onUpload(file);
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    return (
        <Card className={cn("border-dashed border-2", isDragging ? "border-primary bg-primary/5" : "border-muted")}>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                {!file ? (
                    <>
                        <div className="mb-4 rounded-full bg-muted p-4">
                            <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">Upload Financial Data</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Drag and drop your CSV file here, or click to browse.
                        </p>
                        <div className="relative">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Button variant="outline">Select CSV File</Button>
                        </div>
                    </>
                ) : (
                    <div className="w-full max-w-md">
                        <div className="flex items-center justify-between rounded-md border bg-background p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-primary/10 p-2">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={removeFile}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button className="mt-4 w-full" onClick={handleUpload}>
                            Analyze Data
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
