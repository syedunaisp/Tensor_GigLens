"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, CheckCircle, XCircle, Loader2 } from "lucide-react";
import apiClient from "@/lib/api_client";

interface BackendResponse {
    message: string;
}

export function BackendStatus() {
    const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await apiClient.get<BackendResponse>('/');
                setStatus('connected');
                setMessage(res.data.message);
            } catch (error) {
                console.error("Backend check failed:", error);
                setStatus('error');
                setMessage("Failed to connect to backend");
            }
        };

        checkHealth();
    }, []);

    return (
        <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="h-5 w-5 text-purple-600" />
                    Backend Integration Status
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {status === 'loading' && (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Checking connection...</span>
                            </>
                        )}
                        {status === 'connected' && (
                            <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium text-green-600">Connected: {message}</span>
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm font-medium text-red-600">Connection Failed</span>
                            </>
                        )}
                    </div>
                    <Badge variant={status === 'connected' ? 'default' : 'secondary'}>
                        {status === 'connected' ? 'Online' : status === 'loading' ? 'Checking' : 'Offline'}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Connecting to: <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">http://localhost:8000</code>
                </p>
            </CardContent>
        </Card>
    );
}
