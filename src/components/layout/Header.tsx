"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";


export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
                </Button>
            </div>
        </header>
    );
}
